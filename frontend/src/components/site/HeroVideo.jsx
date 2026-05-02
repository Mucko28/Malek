import React, { useEffect, useRef, useState } from "react";
import { HERO_VIDEO_URL } from "../../mock";

/**
 * Smooth scroll-controlled video hero.
 *
 * Approach:
 *  1) Pre-download the entire video as a Blob and feed it to <video> via a
 *     blob: URL. With the file fully in memory, seeks are essentially instant.
 *  2) A single requestAnimationFrame loop continuously polls a target time
 *     (set by the scroll listener) and seeks the video toward it.
 *  3) Light easing (lerp) toward the target hides micro-jitter from frame
 *     quantisation while staying tightly synced with scroll.
 */
const HeroVideo = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);
  const currentSetRef = useRef(0);
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
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

  // Load full video as blob for instant seeking
  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e) {
        // ignore
      }
      setReady(true);
    };
    v.addEventListener("loadeddata", onLoaded);

    const load = async () => {
      try {
        const res = await fetch(HERO_VIDEO_URL);
        if (!res.ok) throw new Error("fetch failed");
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        v.src = objectUrl;
        v.load();
      } catch (e) {
        // fallback: use direct URL with range support
        v.src = HERO_VIDEO_URL;
        v.load();
      }
    };
    load();

    return () => {
      cancelled = true;
      v.removeEventListener("loadeddata", onLoaded);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // rAF loop — always running while ready. Eases video time toward target.
  useEffect(() => {
    if (!ready) return;
    const v = videoRef.current;
    if (!v) return;

    let stopped = false;
    const tick = () => {
      if (stopped) return;
      const dur = v.duration;
      if (dur && !Number.isNaN(dur)) {
        const tgt = targetTimeRef.current;
        const cur = currentSetRef.current;
        // Smoother ease (smaller factor = more lag, fluffier trailing motion)
        const next = cur + (tgt - cur) * 0.15;
        if (Math.abs(next - cur) > 0.001) {
          currentSetRef.current = next;
          try {
            v.currentTime = Math.max(0, Math.min(dur - 0.001, next));
          } catch (e) {
            // ignore
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  // Mobile / reduced motion: just loop
  useEffect(() => {
    if (!ready) return;
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion || isMobile) {
      v.loop = true;
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [ready, reducedMotion, isMobile]);

  // Scroll listener — compute progress and store target time
  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgressPct(p);
      const v = videoRef.current;
      if (v && v.duration && !reducedMotion && !isMobile) {
        targetTimeRef.current = p * (v.duration - 0.001);
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reducedMotion, isMobile, ready]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full"
      style={{
        // Tall scroll distance => more pixels per frame => smoother feel
        height: reducedMotion || isMobile ? "100vh" : "650vh",
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#A8A099]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-white/80 text-sm tracking-widest uppercase">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
              Loading
            </div>
          </div>
        )}
        {/* progress bar (subtle) */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/15">
          <div
            className="h-full bg-white/80"
            style={{ width: `${progressPct * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
