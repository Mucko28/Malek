import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, Star } from "lucide-react";
import { BRAND, HOURS_RANGES } from "../../mock";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Buttery-smooth scroll-scrub via pre-extracted JPEG frames + canvas.
 * Plus a hero CTA that fades out as the user starts scrolling.
 */
const HeroVideo = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const targetIdxRef = useRef(0);
  const currentIdxRef = useRef(0);
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef(null);

  const [meta, setMeta] = useState({ count: 0, fps: 24 });
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openNow, setOpenNow] = useState(false);

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

  // Open-now indicator
  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const dow = now.getDay(); // 0=Sun..6=Sat
      const idx = dow === 0 ? 6 : dow - 1; // map to Mon=0..Sun=6
      const r = HOURS_RANGES[idx];
      const t = now.getHours() + now.getMinutes() / 60;
      setOpenNow(t >= r.open && t < r.close);
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  // Pre-load all frames
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

  // Resize canvas
  useEffect(() => {
    const fit = () => {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      lastDrawnRef.current = -1;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ready]);

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

  // rAF loop
  useEffect(() => {
    if (!ready) return;
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      const tgt = targetIdxRef.current;
      const cur = currentIdxRef.current;
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

  // Mobile loop
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

  // Scroll listener
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

  const loadPct = meta.count > 0 ? Math.round((loaded / meta.count) * 100) : 0;

  // CTA fade — fully visible at top, gone by progress 0.06
  const ctaOpacity = Math.max(0, 1 - progress / 0.06);
  const ctaTranslate = Math.min(40, progress * 600);

  const scrollHint = () => {
    window.scrollTo({
      top: window.innerHeight * 1.1,
      behavior: "smooth",
    });
  };

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

        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3 text-white/85">
              <div className="text-[11px] tracking-[0.4em] uppercase">
                Načítám
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

        {/* Top-center "OPEN NOW" badge */}
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 md:top-8 z-10 transition-all duration-700"
          style={{
            opacity: ready ? 1 : 0,
            transform: `translate(-50%, ${ready ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/12 backdrop-blur-md ring-1 ring-white/20 text-white">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  openNow ? "bg-emerald-400 animate-ping" : "bg-amber-300"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  openNow ? "bg-emerald-400" : "bg-amber-300"
                }`}
              />
            </span>
            <span className="text-[11px] tracking-[0.3em] uppercase">
              {openNow ? "Otevřeno teď" : "Zavřeno"}
            </span>
            <span className="w-px h-3 bg-white/25" />
            <span className="text-[11px] tracking-[0.2em] text-white/85">
              {BRAND.city}
            </span>
          </div>
        </div>

        {/* Bottom-center CTA: NATOČ SI ZMRZKU */}
        <div
          className="absolute bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 z-10 will-change-transform"
          style={{
            opacity: ctaOpacity,
            transform: `translate(-50%, ${ctaTranslate}px)`,
            pointerEvents: ctaOpacity < 0.1 ? "none" : "auto",
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={scrollHint}
              className="group relative inline-flex items-center gap-3 pl-7 pr-3 py-3 rounded-full bg-[#C46B5B] hover:bg-[#A8543F] text-white font-medium text-[15px] tracking-wide transition-all duration-300 shadow-[0_18px_45px_-10px_rgba(196,107,91,0.6)] hover:shadow-[0_22px_55px_-10px_rgba(196,107,91,0.85)] hover:-translate-y-0.5"
            >
              <span>Natoč si zmrzku</span>
              <span className="w-9 h-9 rounded-full bg-white/20 grid place-items-center transition-transform duration-300 group-hover:translate-y-0.5 group-hover:rotate-180">
                <ArrowDown className="w-4 h-4" strokeWidth={2.2} />
              </span>
              {/* spinning star sticker */}
              <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white text-[#2a2724] grid place-items-center font-display font-black text-[10px] shadow-md rotate-12 group-hover:rotate-[24deg] transition-transform">
                <Star
                  className="w-3.5 h-3.5 fill-[#C46B5B] text-[#C46B5B]"
                  strokeWidth={1.5}
                />
              </span>
            </button>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-white/85">
              <span className="w-6 h-px bg-white/40" />
              Skroluj — zmrzlina začne téct
              <span className="w-6 h-px bg-white/40" />
            </div>
          </div>
        </div>

        {/* Bottom progress bar */}
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
