import React, { useEffect, useState } from "react";
import { Instagram, Facebook, Phone, Menu, X, MapPin } from "lucide-react";
import { BRAND, NAV_LINKS, CONTACT } from "../../mock";
import { cn } from "../../lib/utils";/**
 * Floating side dock + drawer menu. Replaces the top navbar so the hero
 * video stays unobstructed.
 *  - Left rail: vertical brand mark + section progress dots + socials
 *  - Top right: small "Menu" pill that opens a full-screen drawer
 */
const SideDock = () => {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  // Track active section by intersection
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Close drawer on route hash click
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <>
      {/* Left vertical rail */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col items-center justify-between py-7 px-4 pointer-events-none">
        {/* Brand mark */}
        <a
          href="#home"
          className="pointer-events-auto group flex flex-col items-center gap-2"
        >
          <div className="w-11 h-11 rounded-full bg-white/12 backdrop-blur-md ring-1 ring-white/20 grid place-items-center transition-all duration-300 group-hover:bg-white group-hover:text-[#2a2724]">
            <span className="font-display font-black text-[15px] text-white group-hover:text-[#2a2724] tracking-tight">
              M
            </span>
          </div>
          <div
            className="font-display text-[10px] tracking-[0.4em] text-white/85 uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {BRAND.short} · {BRAND.city}
          </div>
        </a>

        {/* Progress dots */}
        <nav className="pointer-events-auto flex flex-col items-center gap-3">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.id}
                href={l.href}
                className="group relative flex items-center gap-3"
                aria-label={l.label}
              >
                <span
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    isActive
                      ? "w-1.5 h-7 bg-white"
                      : "w-1.5 h-1.5 bg-white/40 group-hover:bg-white/70"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-5 px-2.5 py-1 rounded-md text-[11px] tracking-wide whitespace-nowrap bg-white text-[#2a2724] font-medium",
                    "opacity-0 -translate-x-1 pointer-events-none transition-all duration-200",
                    "group-hover:opacity-100 group-hover:translate-x-0"
                  )}
                >
                  {l.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Socials */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          {[
            { Icon: Instagram, href: CONTACT.instagram, label: "Instagram" },
            {
              Icon: Facebook,
              href: CONTACT.facebook,
              label: "Facebook",
            },
            { Icon: Phone, href: `tel:${CONTACT.phone}`, label: "Tel" },
          ].map(({ Icon, href, label }, i) => (
            <a
              key={i}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/15 grid place-items-center text-white hover:bg-white hover:text-[#2a2724] transition-all duration-300"
            >
              <Icon className="w-4 h-4" strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </aside>

      {/* Top-right floating menu trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-5 right-5 md:top-7 md:right-7 z-40 group flex items-center gap-2.5 pl-4 pr-2 py-2 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-white hover:bg-white hover:text-[#2a2724] transition-all duration-300 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
        aria-label="Otevřít menu"
      >
        <span className="text-[12px] tracking-[0.25em] uppercase font-medium">
          Menu
        </span>
        <span className="w-8 h-8 rounded-full bg-white text-[#2a2724] grid place-items-center group-hover:bg-[#2a2724] group-hover:text-white transition-colors">
          <Menu className="w-4 h-4" strokeWidth={2} />
        </span>
      </button>

      {/* Mobile mini-brand top-left */}
      <a
        href="#home"
        className="md:hidden fixed top-5 left-5 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 text-white"
      >
        <span className="font-display font-black text-sm">Málek</span>
        <span className="text-[9px] tracking-[0.3em] uppercase opacity-70">
          {BRAND.city}
        </span>
      </a>

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-all duration-500",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-[#1a1816]/60 backdrop-blur-sm transition-opacity duration-500",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        {/* Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-full sm:w-[460px] bg-[#F4EFE8] text-[#2a2724] shadow-2xl flex flex-col transition-transform duration-500 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-7 py-6 border-b border-[#2a2724]/10">
            <div>
              <div className="font-display font-black text-[22px] leading-none">
                {BRAND.name}
              </div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#2a2724]/60 mt-1.5">
                {BRAND.city} · od r. {BRAND.established}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full bg-[#2a2724] text-[#F4EFE8] grid place-items-center hover:bg-[#C46B5B] transition-colors"
              aria-label="Zavřít"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-7 py-4">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between py-5 border-b border-[#2a2724]/10 hover:pl-2 transition-all duration-300"
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-[#2a2724]/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[28px] font-bold leading-none group-hover:text-[#C46B5B] transition-colors">
                    {l.label}
                  </span>
                </span>
                <span className="text-[#C46B5B] opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </a>
            ))}
          </nav>

          <div className="px-7 py-6 border-t border-[#2a2724]/10 space-y-2.5 text-sm">
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-3 hover:text-[#C46B5B] transition-colors"
            >
              <Phone className="w-4 h-4" />
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 hover:text-[#C46B5B] transition-colors"
            >
              <MapPin className="w-4 h-4 mt-0.5" />
              <span>{CONTACT.address}</span>
            </a>
            <div className="pt-3 mt-3 border-t border-[#2a2724]/8">
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-[#2a2724]/35 hover:text-[#2a2724] transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-[#2a2724]/30" />
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDock;
