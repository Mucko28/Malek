import React from "react";
import { STORY, BRAND } from "../../mock";

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-[#F4EFE8] text-[#2a2724] py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-24">
              <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5">
                01 — Příběh
              </div>
              <h2 className="font-display text-[44px] md:text-[64px] leading-[0.95] font-black">
                Zmrzlina,<br />jak má být.
              </h2>
              <div className="mt-8 inline-flex items-center gap-3 text-[12px] tracking-[0.25em] uppercase text-[#2a2724]/60">
                <span className="w-8 h-px bg-[#2a2724]/30" />
                Slatiňany · ČR
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <p className="font-display text-[24px] md:text-[30px] leading-[1.3] font-medium mb-10">
              {STORY.intro}
            </p>
            <div className="space-y-6 text-[16px] md:text-[17px] leading-[1.7] text-[#2a2724]/85 max-w-[58ch]">
              {STORY.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 border-t border-[#2a2724]/15 pt-10">
              {STORY.highlights.map((h) => (
                <div key={h.label}>
                  <div className="font-display text-[40px] md:text-[56px] font-black leading-none text-[#C46B5B]">
                    {h.num}
                  </div>
                  <div className="mt-3 text-[11px] tracking-[0.25em] uppercase text-[#2a2724]/60">
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* huge brand watermark */}
        <div className="mt-24 -mx-6 md:-mx-16 select-none pointer-events-none overflow-hidden">
          <div className="font-display font-black text-[#2a2724]/[0.06] leading-none text-[22vw] tracking-tighter whitespace-nowrap">
            {BRAND.short.toUpperCase()} · {BRAND.city.toUpperCase()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
