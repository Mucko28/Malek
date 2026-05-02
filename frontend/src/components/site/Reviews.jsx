import React from "react";
import { Star, Quote } from "lucide-react";
import { REVIEWS } from "../../mock";

const Reviews = () => {
  return (
    <section
      id="reviews"
      className="relative bg-[#A8A099] text-[#F4EFE8] py-28 md:py-40 overflow-hidden"
    >
      {/* watermark */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
        <div className="font-display font-black text-white/[0.08] text-[22vw] leading-none tracking-tight whitespace-nowrap">
          4 . 6 / 5
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#2a2724] font-semibold mb-5">
              04 — Recenze
            </div>
            <h2 className="font-display text-[44px] md:text-[72px] leading-[0.95] font-black text-[#2a2724]">
              Co říkají<br />naši stálí.
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[#2a2724]">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#2a2724]" />
              ))}
            </div>
            <span className="font-display font-black text-[24px]">4.6</span>
            <span className="text-[12px] tracking-wide opacity-70">/ 5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="relative bg-[#F4EFE8] text-[#2a2724] rounded-3xl p-7 shadow-[0_20px_50px_rgba(42,39,36,0.10)] hover:-translate-y-1 transition-transform duration-500"
            >
              <Quote className="absolute top-6 right-6 w-7 h-7 text-[#C46B5B]/40" />
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star
                    key={k}
                    className="w-4 h-4 fill-[#C46B5B] text-[#C46B5B]"
                  />
                ))}
              </div>
              <p className="text-[15.5px] leading-[1.65]">„{r.text}“</p>
              <div className="mt-7 pt-5 border-t border-[#2a2724]/10">
                <div className="font-display font-bold">{r.name}</div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-[#2a2724]/55 mt-1">
                  {r.when}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
