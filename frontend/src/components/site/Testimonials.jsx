import React from "react";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../mock";

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative bg-[#F7C6CF] py-24 md:py-32 overflow-hidden">
      {/* Decorative big word */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <span className="font-display font-black text-white/40 text-[18vw] leading-none tracking-tight whitespace-nowrap">
          LOVED
        </span>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full text-[#8E2A4A] text-xs tracking-[0.25em] uppercase font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#8E2A4A] text-[#8E2A4A]" />
            Testimonials
          </div>
          <h2 className="font-display mt-5 text-[42px] md:text-[64px] leading-[0.95] font-extrabold text-[#5b1f33]">
            Sweet words from <br />
            our regulars.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.id}
              className="group relative bg-white rounded-[28px] p-7 shadow-[0_10px_30px_rgba(190,60,90,0.10)] hover:shadow-[0_20px_50px_rgba(190,60,90,0.20)] transition-all duration-500 hover:-translate-y-1"
              style={{ transform: `rotate(${(i - 1) * 0.6}deg)` }}
            >
              <Quote className="absolute top-6 right-6 w-7 h-7 text-[#F7C6CF]" />
              <div className="flex items-center gap-1 text-[#8E2A4A] mb-5">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-[#8E2A4A]" />
                ))}
              </div>
              <p className="text-[#5b1f33] text-[15.5px] leading-relaxed">
                “{t.quote}”
              </p>
              <div className="mt-7 flex items-center gap-3 pt-5 border-t border-[#F7C6CF]/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F7C6CF]"
                />
                <div>
                  <div className="font-display font-bold text-[#5b1f33]">
                    {t.name}
                  </div>
                  <div className="text-xs text-[#8E2A4A]/70">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
