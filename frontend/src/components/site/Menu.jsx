import React from "react";
import { OFFER, GALLERY } from "../../mock";
import { ArrowUpRight } from "lucide-react";

const Menu = () => {
  return (
    <section
      id="menu"
      className="relative bg-[#2a2724] text-[#F4EFE8] py-28 md:py-40 overflow-hidden"
    >
      {/* Soft accent blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#C46B5B]/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full bg-[#A8A099]/12 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="mb-16">
          <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C46B5B]" />
            02 — Nabídka
          </div>
          <h2 className="font-display text-[44px] md:text-[80px] leading-[0.92] font-black max-w-[14ch]">
            Co u nás můžete ochutnat.
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-8 md:gap-14 items-center">
          {/* Left — large photo */}
          <div className="col-span-12 md:col-span-6">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                <img
                  src={GALLERY[1]}
                  alt="Točená zmrzlina"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
              </div>
              {/* Overlap card */}
              <div className="hidden md:block absolute -bottom-10 -right-8 max-w-[260px] bg-[#F4EFE8] text-[#2a2724] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] rotate-[-3deg]">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#C46B5B] font-bold">
                  Točeno denně
                </div>
                <div className="font-display font-bold text-[18px] leading-tight mt-1.5">
                  Domácí kvalita ze Slatiňan.
                </div>
              </div>
            </div>
          </div>

          {/* Right — categories list */}
          <div className="col-span-12 md:col-span-6">
            <p className="text-[16px] md:text-[18px] leading-[1.65] text-white/75 max-w-[44ch] mb-10">
              {OFFER.description}
            </p>

            <ul className="border-t border-white/10">
              {OFFER.categories.map((cat, i) => (
                <li
                  key={cat.name}
                  className="group flex items-center justify-between gap-6 py-5 border-b border-white/10 transition-colors hover:bg-white/[0.03] -mx-3 px-3 rounded-md cursor-default"
                >
                  <div className="flex items-baseline gap-5 min-w-0">
                    <span className="font-mono text-[11px] text-white/30 tabular-nums shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="font-display font-bold text-[22px] md:text-[26px] leading-none block group-hover:text-[#C46B5B] transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[12px] tracking-[0.15em] uppercase text-white/45 mt-2 block">
                        {cat.note}
                      </span>
                    </span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#C46B5B] group-hover:rotate-12 transition-all shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
