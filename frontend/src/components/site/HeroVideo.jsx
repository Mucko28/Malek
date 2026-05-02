import React, { useEffect, useRef, useState } from "react";
import { HERO_VIDEO_URL } from "../../mock";

/**
 * Smooth scroll-controlled video hero.
 *
 * Smoothness strategy:
 * 1) Fetch the entire video as a Blob and use a blob: URL as the src.
 *    This guarantees the full video sits in memory => seeks are instantaneous.
 * 2) On scroll, just store the target time. A single rAF loop sets
 *    video.currentTime once per frame (no easing/lerp races).
 * 3) Use requestVideoFrameCallback when available so we know when a frame
 *    has actually been decoded (prevents skipped frames).
 * 4) Keep the video paused (playbackRate = 0) so it never advances on its own.
 */
const HeroVideo = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);
  const lastSetRef = useRef(-1);
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);
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

    const load = async () => {
      try {
        const res = await fetch(HERO_VIDEO_URL);
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        v.src = objectUrl;
        v.load();
      } catch (e) {
        // fallback: use direct URL
        if (!v.src) v.src = HERO_VIDEO_URL;
      }
    };
    load();

    const onLoaded = () => {
      try {
        v.pause();
        v.playbackRate = 0;
        v.currentTime = 0.001;
      } catch (e) {}
      setReady(true);
    };
    v.addEventListener("loadeddata", onLoaded);

    return () => {
      cancelled = true;
      v.removeEventListener("loadeddata", onLoaded);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // rAF loop: seek video toward target time exactly once per frame
  useEffect(() => {
    if (!ready) return;
    const v = videoRef.current;
    if (!v) return;

    let stopped = false;

    // Use requestVideoFrameCallback if available for tighter sync
    const hasRVFC = typeof v.requestVideoFrameCallback === "function";

    const apply = () => {
      if (stopped) return;
      const tgt = targetTimeRef.current;
      if (v.duration && Math.abs(tgt - lastSetRef.current) > 0.0005) {
        try {
          v.currentTime = Math.max(0, Math.min(v.duration - 0.001, tgt));
          lastSetRef.current = tgt;
        } catch (e) {}
      }
      if (hasRVFC) {
        v.requestVideoFrameCallback(apply);
      } else {
        rafRef.current = requestAnimationFrame(apply);
      }
    };

    if (hasRVFC) {
      v.requestVideoFrameCallback(apply);
    } else {
      rafRef.current = requestAnimationFrame(apply);
    }

    return () => {
      stopped = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  // Mobile / reduced motion: just loop the video
  useEffect(() => {
    if (!ready) return;
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion || isMobile) {
      v.playbackRate = 1;
      v.loop = true;
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [ready, reducedMotion, isMobile]);

  // Scroll listener -> compute progress -> store target time
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      const v = videoRef.current;
      if (v && v.duration && !reducedMotion && !isMobile) {
        // ease the mapped progress slightly to avoid micro-jitter
        targetTimeRef.current = p * (v.duration - 0.001);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [reducedMotion, isMobile]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full"
      style={{
        // Generous scroll distance => more pixels per frame => smoother feel
        height: reducedMotion || isMobile ? "100vh" : "500vh",
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#A8A099]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          // src set via blob URL in effect
        />
        {/* subtle vignette to integrate with page */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.12)_100%)]" />
      </div>
    </section>
  );
};

export default HeroVideo;
