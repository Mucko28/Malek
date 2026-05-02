import React from "react";
import { Star, Quote } from "lucide-react";
import { REVIEWS } from "../../mock";

const Reviews = () => {
  return (
    <section
      id="reviews"
      className="relative bg-[#A8A099] text-[#F4EFE8] py-28 md:py-40 overflow-hidden"
    >
      {/* huge rotating watermark */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
        <div className="font-display font-black text-white/[0.10] text-[26vw] leading-none tracking-tighter whitespace-nowrap">
          4.6 ★
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#2a2724] font-semibold mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-[#2a2724]" />
              04 — Recenze
            </div>
            <h2 className="font-display text-[44px] md:text-[80px] leading-[0.92] font-black text-[#2a2724]">
              Co říkají<br />naši stálí.
            </h2>
          </div>

          {/* Big rating display */}
          <div className="flex items-center gap-5 bg-[#2a2724] text-white px-6 py-5 rounded-3xl">
            <div>
              <div className="font-display font-black text-[48px] leading-none">
                4.6
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mt-1.5">
                z 5 hvězd
              </div>
            </div>
            <div className="w-px h-12 bg-white/15" />
            <div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#C46B5B] text-[#C46B5B]"
                  />
                ))}
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/60 mt-2">
                15+ recenzí · Mapy.cz
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="relative bg-[#F4EFE8] text-[#2a2724] rounded-3xl p-7 shadow-[0_24px_50px_-10px_rgba(42,39,36,0.18)] hover:-translate-y-2 transition-transform duration-500"
              style={{
                transform: `rotate(${(i - 1) * 0.8}deg)`,
              }}
            >
              {/* Big tape sticker on top */}
              <div className="absolute -top-4 left-6 right-6 h-7 bg-[#C46B5B]/30 rounded-sm rotate-[-1deg] backdrop-blur-sm" />

              <Quote className="absolute top-6 right-6 w-9 h-9 text-[#C46B5B]/30" />

              <div className="flex gap-0.5 mb-5 relative">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star
                    key={k}
                    className="w-4 h-4 fill-[#C46B5B] text-[#C46B5B]"
                  />
                ))}
              </div>

              <p className="text-[15.5px] leading-[1.65] relative">
                <span className="text-[#C46B5B] text-[24px] font-display font-black leading-none mr-1">
                  „
                </span>
                {r.text}
                <span className="text-[#C46B5B] text-[24px] font-display font-black leading-none">
                  "
                </span>
              </p>

              <div className="mt-7 pt-5 border-t border-[#2a2724]/10 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold">{r.name}</div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-[#2a2724]/55 mt-1">
                    {r.when}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#2a2724]/30 tabular-nums">
                  0{i + 1} / 0{REVIEWS.length}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Footer hint */}
        <div className="mt-14 flex items-center justify-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#2a2724]/60">
          <span className="w-10 h-px bg-[#2a2724]/30" />
          Hodnocení ověřena na mapy.cz · firmy.cz
          <span className="w-10 h-px bg-[#2a2724]/30" />
        </div>
      </div>
    </section>
  );
};

export default Reviews;
