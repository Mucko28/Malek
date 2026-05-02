import React, { useState } from "react";
import { MENU } from "../../mock";
import { cn } from "../../lib/utils";

const Menu = () => {
  const [tab, setTab] = useState("softServe");
  const active = MENU[tab];

  return (
    <section
      id="menu"
      className="relative bg-[#2a2724] text-[#F4EFE8] py-28 md:py-40 overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5">
              02 — Nabídka
            </div>
            <h2 className="font-display text-[44px] md:text-[72px] leading-[0.95] font-black">
              Co u nás<br />můžete ochutnat.
            </h2>
          </div>
          <div className="flex gap-2">
            {[
              { id: "softServe", label: "Točená" },
              { id: "granita", label: "Tříště" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "px-6 py-3 rounded-full text-[14px] tracking-wide transition-all duration-300",
                  tab === t.id
                    ? "bg-[#F4EFE8] text-[#2a2724]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 md:gap-12 mb-12">
          <div className="col-span-12 md:col-span-5">
            <h3 className="font-display text-[34px] md:text-[42px] font-bold leading-tight">
              {active.title}
            </h3>
            <div className="text-[#C46B5B] text-[13px] tracking-[0.25em] uppercase mt-2">
              {active.subtitle}
            </div>
            <p className="mt-6 text-[16px] leading-[1.7] text-white/70 max-w-[40ch]">
              {active.description}
            </p>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {active.flavours.map((f, i) => (
                <div
                  key={f.name}
                  className="group relative overflow-hidden flex items-center gap-4 px-5 py-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 transition-all duration-300"
                >
                  <span
                    className="w-10 h-10 rounded-full ring-2 ring-white/20 group-hover:scale-110 transition-transform duration-500 shrink-0"
                    style={{ background: f.color }}
                  />
                  <div className="flex-1">
                    <div className="font-display font-bold text-[18px] leading-none">
                      {f.name}
                    </div>
                    <div className="text-[12px] text-white/55 mt-1.5">
                      {f.note}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-white/30 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing strip */}
        <div className="mt-16 border-t border-white/10 pt-10">
          <div className="text-[11px] tracking-[0.4em] uppercase text-white/50 mb-6">
            Ceník · Aktuální sezóna
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {MENU.pricing.map((p) => (
              <div
                key={p.label}
                className="flex flex-col gap-2 px-5 py-6 rounded-2xl ring-1 ring-white/10 bg-white/[0.03]"
              >
                <span className="text-[12px] tracking-wide text-white/60 uppercase">
                  {p.label}
                </span>
                <span className="font-display text-[28px] font-black">
                  {p.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
