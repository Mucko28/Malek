import React, { useEffect, useRef, useState } from "react";

/**
 * Buttery-smooth scroll-scrub via pre-extracted JPEG frames + canvas.
 *
 * Why canvas instead of <video>?
 *   Browsers cannot seek a video reliably between non-keyframes; every
 *   currentTime change triggers a decoder re-seek which adds latency and
 *   stutter. Painting an already-decoded <img> on a 2D canvas is essentially
 *   free, so the scroll feels frame-perfect — like the video is playing
 *   directly under the user's mouse wheel.
 *
 * Strategy:
 *   1) Fetch /api/frames/info to learn how many frames we have.
 *   2) Pre-load every frame as an HTMLImageElement (parallel decode).
 *   3) On scroll, compute progress -> active frame index, and request a
 *      paint via rAF. The rAF loop uses light easing for trailing motion.
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HeroVideo = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]); // HTMLImageElement[]
  const targetIdxRef = useRef(0);
  const currentIdxRef = useRef(0);
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef(null);

  const [meta, setMeta] = useState({ count: 0, fps: 24 });
  const [loaded, setLoaded] = useState(0); // how many frames decoded
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Step 1+2: get frame count, then pre-load all frames in parallel
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/frames/info`);
        const info = await res.json();
        if (cancelled || !info.count) return;
        setMeta(info);

        const total = info.count;
        const imgs = new Array(total);
        let done = 0;

        // Kick off all loads in parallel — browser will cap concurrency.
        await Promise.all(
          Array.from({ length: total }, (_, i) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.decoding = "async";
              img.src = `${API}/frames/frame_${String(i).padStart(3, "0")}.jpg`;
              img.onload = () => {
                imgs[i] = img;
                done += 1;
                setLoaded(done);
                resolve();
              };
              img.onerror = () => {
                done += 1;
                setLoaded(done);
                resolve();
              };
            });
          })
        );

        if (cancelled) return;
        framesRef.current = imgs.filter(Boolean);
        setReady(true);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Resize canvas to match container, redraw current frame
  useEffect(() => {
    const fit = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      lastDrawnRef.current = -1; // force redraw at new size
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ready]);

  // Drawing helper
  const drawFrame = (idx) => {
    const c = canvasRef.current;
    const frames = framesRef.current;
    if (!c || !frames.length) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const safeIdx = Math.max(0, Math.min(frames.length - 1, Math.round(idx)));
    if (safeIdx === lastDrawnRef.current) return;
    const img = frames[safeIdx];
    if (!img) return;
    const cw = c.width;
    const ch = c.height;
    // contain-fit to preserve full ice cream visibility
    const ir = img.width / img.height;
    const cr = cw / ch;
    let dw, dh, dx, dy;
    if (cr > ir) {
      dh = ch;
      dw = ch * ir;
      dx = (cw - dw) / 2;
      dy = 0;
    } else {
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnRef.current = safeIdx;
  };

  // rAF loop — eases current frame index toward target. Always running.
  useEffect(() => {
    if (!ready) return;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      const tgt = targetIdxRef.current;
      const cur = currentIdxRef.current;
      // Light easing for fluid trailing motion (raise to 1.0 for instant)
      const next = cur + (tgt - cur) * 0.22;
      currentIdxRef.current = next;
      drawFrame(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  // Scroll listener — sets target frame index from scroll progress
  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgress(p);
      const count = framesRef.current.length || meta.count || 1;
      targetIdxRef.current = p * (count - 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [meta.count, ready]);

  // Mobile / reduced motion: gentle auto-advance loop instead of scroll
  useEffect(() => {
    if (!ready) return;
    if (!(reducedMotion || isMobile)) return;
    const count = framesRef.current.length;
    if (!count) return;
    const start = performance.now();
    let stopped = false;
    const fps = meta.fps || 24;
    const loop = (t) => {
      if (stopped) return;
      const secs = (t - start) / 1000;
      const idx = (secs * fps) % count;
      currentIdxRef.current = idx;
      drawFrame(idx);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => {
      stopped = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reducedMotion, isMobile, meta.fps]);

  const loadPct =
    meta.count > 0 ? Math.round((loaded / meta.count) * 100) : 0;

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full"
      style={{
        height: reducedMotion || isMobile ? "100vh" : "650vh",
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#A8A099]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3 text-white/85">
              <div className="text-[11px] tracking-[0.4em] uppercase">
                Loading
              </div>
              <div className="w-48 h-[2px] bg-white/15 overflow-hidden rounded-full">
                <div
                  className="h-full bg-white/85 transition-all duration-150"
                  style={{ width: `${loadPct}%` }}
                />
              </div>
              <div className="text-[10px] tracking-[0.3em] text-white/60 tabular-nums">
                {loaded} / {meta.count || "…"}
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full bg-white/80"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
