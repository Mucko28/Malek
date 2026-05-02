import React, { useEffect, useRef, useState } from "react";
import { STORY, BRAND, GALLERY } from "../../mock";
import { Sparkles, IceCream2 } from "lucide-react";

/** Hook: trigger a callback once when an element enters the viewport */
const useInView = (threshold = 0.25) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/** Number that counts up when it enters the viewport */
const CountUp = ({ value, suffix = "", duration = 1500, decimals = 0 }) => {
  const [ref, inView] = useInView(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    const target = parseFloat(value);
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {decimals > 0 ? n.toFixed(decimals) : Math.round(n)}
      {suffix}
    </span>
  );
};

const About = () => {
  const [titleRef, titleInView] = useInView(0.3);

  return (
    <section
      id="about"
      className="relative bg-[#F4EFE8] text-[#2a2724] py-28 md:py-40 overflow-hidden"
    >
      {/* Decorative floating sticker */}
      <div className="hidden md:block absolute right-12 top-24 rotate-[12deg] z-10">
        <div className="bg-[#C46B5B] text-white rounded-full w-32 h-32 grid place-items-center shadow-[0_18px_40px_-12px_rgba(196,107,91,0.5)] animate-[spin_18s_linear_infinite]">
          <svg viewBox="0 0 200 200" className="w-full h-full p-3">
            <defs>
              <path
                id="circ"
                d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
              />
            </defs>
            <text className="fill-white" fontSize="20" letterSpacing="3.5">
              <textPath href="#circ">
                ★ TOČENÁ RADOST ★ SLATIŇANY ★
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 md:px-16 relative">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-24">
              <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-[#C46B5B]" />
                01 — Příběh
              </div>
              <h2
                ref={titleRef}
                className="font-display text-[44px] md:text-[68px] leading-[0.95] font-black"
              >
                <span
                  className="block transition-all duration-700"
                  style={{
                    transform: titleInView
                      ? "translateY(0)"
                      : "translateY(40px)",
                    opacity: titleInView ? 1 : 0,
                  }}
                >
                  Zmrzlina,
                </span>
                <span
                  className="block transition-all duration-700 delay-100"
                  style={{
                    transform: titleInView
                      ? "translateY(0)"
                      : "translateY(40px)",
                    opacity: titleInView ? 1 : 0,
                  }}
                >
                  jak má být.
                </span>
              </h2>
              <div className="mt-8 inline-flex items-center gap-3 text-[12px] tracking-[0.25em] uppercase text-[#2a2724]/60">
                <span className="w-8 h-px bg-[#2a2724]/30" />
                Slatiňany · ČR
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <p className="font-display text-[26px] md:text-[34px] leading-[1.25] font-medium mb-10">
              {STORY.intro}
            </p>
            <div className="space-y-6 text-[16px] md:text-[17px] leading-[1.7] text-[#2a2724]/85 max-w-[58ch]">
              {STORY.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Stats with count-up */}
            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 border-t border-[#2a2724]/15 pt-10">
              <Stat
                value={STORY.highlights[0].num}
                label={STORY.highlights[0].label}
                decimals={1}
              />
              <Stat
                value="20"
                suffix="+"
                label="Let v provozu"
                decimals={0}
              />
              <Stat
                value="100"
                suffix=" %"
                label="Točeno na místě"
                decimals={0}
              />
            </div>

            {/* Inline collage strip */}
            <div className="mt-14 grid grid-cols-3 gap-3 md:gap-4">
              {GALLERY.slice(0, 3).map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl aspect-[4/5] group ${
                    i === 1 ? "translate-y-6" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#2a2724]/10 rounded-2xl pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* huge brand watermark */}
        <div className="mt-24 -mx-6 md:-mx-16 select-none pointer-events-none overflow-hidden">
          <div className="font-display font-black text-[#2a2724]/[0.06] leading-none text-[22vw] tracking-tighter whitespace-nowrap flex items-center gap-12">
            <IceCream2 className="w-[10vw] h-[10vw]" strokeWidth={1.4} />
            {BRAND.short.toUpperCase()}
            <Sparkles className="w-[6vw] h-[6vw]" strokeWidth={1.4} />
            {BRAND.city.toUpperCase()}
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, suffix = "", label, decimals = 0 }) => (
  <div className="group">
    <div className="font-display text-[44px] md:text-[64px] font-black leading-none text-[#C46B5B] group-hover:text-[#A8543F] transition-colors">
      <CountUp value={value} suffix={suffix} decimals={decimals} />
    </div>
    <div className="mt-3 text-[11px] tracking-[0.25em] uppercase text-[#2a2724]/60">
      {label}
    </div>
  </div>
);

export default About;
