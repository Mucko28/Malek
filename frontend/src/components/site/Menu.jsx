import React, { useState } from "react";
import { MENU } from "../../mock";
import { cn } from "../../lib/utils";
import { Plus } from "lucide-react";

const Menu = () => {
  const [tab, setTab] = useState("softServe");
  const active = MENU[tab];

  return (
    <section
      id="menu"
      className="relative bg-[#2a2724] text-[#F4EFE8] py-28 md:py-40 overflow-hidden"
    >
      {/* Floating soft gradient blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#C46B5B]/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full bg-[#A8A099]/15 blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-[#C46B5B]" />
              02 — Nabídka
            </div>
            <h2 className="font-display text-[44px] md:text-[80px] leading-[0.92] font-black">
              Co u nás<br />
              <span className="relative inline-block">
                můžete
                <svg
                  className="absolute left-0 -bottom-2 w-full"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  height="10"
                >
                  <path
                    d="M2 8 Q 80 2, 150 7 T 298 6"
                    stroke="#C46B5B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              ochutnat.
            </h2>
          </div>
          <div className="inline-flex p-1 rounded-full bg-white/[0.06] ring-1 ring-white/10 self-start md:self-end">
            {[
              { id: "softServe", label: "Točená", count: "6" },
              { id: "granita", label: "Tříště", count: "4" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative px-6 py-3 rounded-full text-[14px] tracking-wide transition-all duration-500 flex items-center gap-2",
                  tab === t.id
                    ? "bg-[#F4EFE8] text-[#2a2724] shadow-[0_8px_22px_rgba(0,0,0,0.25)]"
                    : "text-white/70 hover:text-white"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full",
                    tab === t.id
                      ? "bg-[#C46B5B] text-white"
                      : "bg-white/10 text-white/60"
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 md:gap-12 mb-16">
          <div className="col-span-12 md:col-span-5">
            <div className="sticky top-24">
              <h3 className="font-display text-[36px] md:text-[48px] font-bold leading-tight">
                {active.title}
              </h3>
              <div className="text-[#C46B5B] text-[13px] tracking-[0.25em] uppercase mt-2">
                {active.subtitle}
              </div>
              <p className="mt-6 text-[16px] leading-[1.7] text-white/70 max-w-[42ch]">
                {active.description}
              </p>

              {/* Decorative scoop SVG */}
              <div className="mt-10 hidden md:block">
                <Scoop tab={tab} />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {active.flavours.map((f, i) => (
                <FlavourCard key={f.name} flavour={f} idx={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing strip */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <div className="flex items-end justify-between mb-6">
            <div className="text-[11px] tracking-[0.4em] uppercase text-white/50">
              Ceník · Aktuální sezóna
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/35">
              Kč · CZK
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {MENU.pricing.map((p, i) => (
              <div
                key={p.label}
                className="relative flex flex-col gap-2 px-5 py-6 rounded-2xl ring-1 ring-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute top-3 right-4 font-mono text-[10px] text-white/20 tabular-nums">
                  0{i + 1}
                </span>
                <span className="text-[12px] tracking-wide text-white/60 uppercase">
                  {p.label}
                </span>
                <span className="font-display text-[30px] font-black">
                  {p.price}
                </span>
                <span className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-[#C46B5B]/0 group-hover:bg-[#C46B5B]/30 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/** Individual flavour card with hover scoop graphic */
const FlavourCard = ({ flavour, idx }) => {
  return (
    <div
      className="group relative overflow-hidden flex items-center gap-4 px-5 py-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Color blob ringed scoop */}
      <span className="relative w-12 h-12 shrink-0">
        <span
          className="absolute inset-0 rounded-full ring-2 ring-white/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: flavour.color }}
        />
        <span
          className="absolute inset-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)`,
          }}
        />
      </span>

      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[18px] leading-none">
          {flavour.name}
        </div>
        <div className="text-[12px] text-white/55 mt-1.5">{flavour.note}</div>
      </div>

      <span className="font-mono text-[11px] text-white/30 tabular-nums">
        {String(idx + 1).padStart(2, "0")}
      </span>

      {/* hover plus icon overlay */}
      <span className="absolute right-4 top-4 w-7 h-7 rounded-full bg-[#C46B5B] text-white grid place-items-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <Plus className="w-3.5 h-3.5" />
      </span>
    </div>
  );
};

/** Decorative SVG: a stylised soft-serve cone */
const Scoop = ({ tab }) => {
  if (tab === "granita") {
    return (
      <svg viewBox="0 0 200 240" className="w-44 h-52">
        <defs>
          <linearGradient id="cup" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3b3431" />
            <stop offset="1" stopColor="#1d1815" />
          </linearGradient>
          <linearGradient id="liquid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#F0A752" />
            <stop offset="1" stopColor="#C4536A" />
          </linearGradient>
        </defs>
        {/* cup */}
        <path
          d="M 50 80 L 60 220 Q 100 234, 140 220 L 150 80 Z"
          fill="url(#cup)"
        />
        {/* liquid top */}
        <ellipse cx="100" cy="80" rx="50" ry="14" fill="url(#liquid)" />
        {/* straw */}
        <rect
          x="92"
          y="20"
          width="6"
          height="80"
          rx="3"
          fill="#C46B5B"
          transform="rotate(8 95 60)"
        />
        {/* ice highlights */}
        {[20, 35, 60, 80].map((cx, i) => (
          <circle
            key={i}
            cx={cx + 50}
            cy={80 + Math.sin(i) * 2}
            r="3"
            fill="white"
            opacity="0.6"
          />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 260" className="w-44 h-56">
      <defs>
        <linearGradient id="cone" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#C18B5B" />
          <stop offset="1" stopColor="#7A4A2D" />
        </linearGradient>
        <linearGradient id="cream" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F8EAD0" />
          <stop offset="1" stopColor="#D4B98E" />
        </linearGradient>
      </defs>
      {/* cone */}
      <path d="M 60 130 L 100 250 L 140 130 Z" fill="url(#cone)" />
      {/* waffle pattern */}
      <g stroke="#5A3A20" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={60 + i * 16}
            y1="130"
            x2={100 + (i - 2) * 8}
            y2="250"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={140 - i * 16}
            y1="130"
            x2={100 + (2 - i) * 8}
            y2="250"
          />
        ))}
      </g>
      {/* swirl ice cream */}
      <path
        d="M 50 130 Q 50 100, 75 95 Q 60 70, 100 70 Q 140 65, 145 95 Q 165 105, 150 130 Z"
        fill="url(#cream)"
      />
      <ellipse cx="100" cy="78" rx="38" ry="12" fill="#FFF" opacity="0.6" />
      <ellipse cx="100" cy="100" rx="46" ry="11" fill="#FFF" opacity="0.4" />
      {/* drip */}
      <path
        d="M 70 128 q 4 14, -2 22 q -6 -2, -4 -10 z"
        fill="url(#cream)"
      />
    </svg>
  );
};

export default Menu;
