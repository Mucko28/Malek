import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HERO_STATES, HERO_VIDEO_URL, HAPPY_CUSTOMERS } from "../../mock";
import { cn } from "../../lib/utils";

/**
 * Scroll-controlled video hero.
 * - A tall outer container drives scroll progress (0..1)
 * - An inner sticky stage holds the video + UI
 * - video.currentTime is set from scroll progress
 * - Hero text states cross-fade based on progress
 */
const HeroVideo = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const targetTimeRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smoothly drive video.currentTime towards target based on scroll progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onMeta = () => {
      setDuration(v.duration || 0);
    };
    const onLoadedData = () => {
      // ensure first frame is rendered, then pause for scroll control
      try {
        v.currentTime = 0.01;
      } catch (e) {}
    };
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("loadeddata", onLoadedData);
    if (v.readyState >= 1) onMeta();

    // Kick off buffering on desktop
    const kick = async () => {
      try {
        await v.play();
        if (!reducedMotion && !isMobile) v.pause();
      } catch (e) {
        // ignore
      }
    };
    kick();

    const tick = () => {
      const video = videoRef.current;
      if (video && video.duration) {
        const cur = video.currentTime;
        const tgt = targetTimeRef.current;
        // ease toward target for smoothness
        const next = cur + (tgt - cur) * 0.18;
        if (Math.abs(tgt - cur) > 0.01) {
          try {
            video.currentTime = Math.max(
              0,
              Math.min(video.duration - 0.05, next)
            );
          } catch (e) {
            // ignore seek errors
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("loadeddata", onLoadedData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile / reduced motion: just autoplay loop
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion || isMobile) {
      v.loop = true;
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [reducedMotion, isMobile]);

  // Scroll listener: compute progress through hero container
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      setProgress(p);
      const v = videoRef.current;
      if (v && v.duration && !reducedMotion && !isMobile) {
        targetTimeRef.current = p * (v.duration - 0.05);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, isMobile]);

  // Active hero text state by progress segments
  const segments = HERO_STATES.length;
  const activeIndex = Math.min(
    segments - 1,
    Math.floor(progress * segments * 0.999)
  );
  // Always-visible text; activeIndex transition handles content swap
  const textOpacity = 1;

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full"
      style={{ height: reducedMotion || isMobile ? "100vh" : "320vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Soft pink ambient backdrop layer */}
        <div className="absolute inset-0 bg-[#F7C6CF]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7C6CF] via-[#F8CDD5] to-[#F4B8C4]" />

        {/* Decorative giant ICE / CREAM word backdrop, like reference */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
          <h1 className="font-display font-black text-white/85 leading-[0.85] tracking-tight text-[28vw] md:text-[22vw] whitespace-nowrap">
            {HERO_STATES[activeIndex].title}
          </h1>
        </div>

        {/* Video — dominant, centered. Slight rounded mask for the look */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative w-[78%] md:w-[58%] lg:w-[48%] aspect-[9/12] md:aspect-[3/4] max-h-[88vh]">
            <div className="absolute -inset-6 rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)] blur-2xl" />
            <video
              ref={videoRef}
              src={HERO_VIDEO_URL}
              className="relative w-full h-full object-cover rounded-[28px] shadow-[0_30px_80px_rgba(142,42,74,0.28)]"
              muted
              playsInline
              preload="auto"
              poster=""
            />
            {/* subtle pink glow ring */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/40" />
          </div>
        </div>

        {/* Foreground UI: eyebrow, copy, CTA */}
        <div className="relative z-10 h-full mx-auto max-w-[1400px] px-5 md:px-10 pt-28 md:pt-32 pb-10 flex flex-col">
          <div className="flex-1 grid grid-cols-12 gap-6 items-end">
            {/* Left side text */}
            <div className="col-span-12 md:col-span-5">
              <div
                className="transition-opacity duration-300"
                style={{ opacity: textOpacity }}
              >
                <div className="text-white/95 font-display text-[22px] md:text-[28px] font-medium drop-shadow-sm">
                  {HERO_STATES[activeIndex].eyebrow}
                </div>
                <p className="mt-6 max-w-sm text-[15px] md:text-[15.5px] leading-relaxed text-[#5b1f33]/85">
                  {HERO_STATES[activeIndex].copy}
                </p>
                <button className="mt-8 inline-flex items-center gap-2 bg-[#8E2A4A] hover:bg-[#7a2440] text-white pl-7 pr-3 py-3.5 rounded-full font-medium tracking-wide transition-all duration-300 shadow-[0_10px_24px_rgba(142,42,74,0.32)] hover:shadow-[0_14px_30px_rgba(142,42,74,0.4)] hover:translate-y-[-1px]">
                  Buy Now
                  <span className="w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>

            {/* Right side accent */}
            <div className="col-span-12 md:col-span-7 flex flex-col items-end justify-end">
              <div
                className="transition-opacity duration-300 text-right"
                style={{ opacity: textOpacity }}
              >
                <div className="font-display text-white text-[28px] md:text-[40px] font-medium drop-shadow-sm">
                  {HERO_STATES[activeIndex].accent}
                </div>
              </div>

              {/* Customers chip */}
              <div className="mt-6 flex items-center gap-3 bg-white/65 backdrop-blur-md px-3 py-2 rounded-full shadow-[0_8px_20px_rgba(190,60,90,0.12)]">
                <div className="flex -space-x-2">
                  {HAPPY_CUSTOMERS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="customer"
                      className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
                <div className="w-9 h-9 rounded-full bg-[#E294A6] text-white grid place-items-center text-[12px] font-bold">
                  100+
                </div>
                <span className="pr-2 text-[#5b1f33] text-sm font-medium">
                  Happy clients
                </span>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="flex flex-col items-center gap-1 text-[#5b1f33]/70 text-xs font-medium tracking-[0.25em] uppercase pb-2"
            style={{ opacity: 1 - progress * 1.4 }}
          >
            <span>Scroll</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
          <div
            className="h-full bg-[#8E2A4A] transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      {/* Hidden helper for duration; not strictly needed */}
      <span className={cn("hidden")}>{duration}</span>
    </section>
  );
};

export default HeroVideo;
