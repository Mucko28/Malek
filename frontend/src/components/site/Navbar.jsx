import React, { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart, IceCream2, Menu, X } from "lucide-react";
import { BRAND, NAV_LINKS } from "../../mock";
import { cn } from "../../lib/utils";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div
          className={cn(
            "flex items-center justify-between gap-4 transition-all duration-300",
            scrolled
              ? "bg-[#F7C6CF]/85 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_8px_30px_rgba(190,60,90,0.12)]"
              : ""
          )}
        >
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div className="w-11 h-11 rounded-full bg-white/70 backdrop-blur grid place-items-center shadow-sm">
              <IceCream2 className="w-6 h-6 text-[#8E2A4A]" strokeWidth={2.2} />
            </div>
            <div className="leading-none font-display">
              <div className="text-[18px] font-extrabold tracking-wide text-[#8E2A4A]">
                {BRAND.short}
              </div>
              <div className="text-[10px] tracking-[0.25em] text-[#8E2A4A]/70 mt-0.5">
                CO.
              </div>
            </div>
          </a>

          {/* Pill nav */}
          <nav className="hidden lg:flex items-center bg-white/55 backdrop-blur-md rounded-full px-2 py-2 shadow-[0_8px_24px_rgba(190,60,90,0.08)]">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300",
                    isActive
                      ? "bg-white text-[#8E2A4A] shadow-[0_6px_18px_rgba(190,60,90,0.18)]"
                      : "text-[#5b1f33]/80 hover:text-[#8E2A4A]"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-3">
            {[Search, Heart, ShoppingCart].map((Icon, i) => (
              <button
                key={i}
                aria-label="icon-button"
                className="w-11 h-11 rounded-full bg-white/55 backdrop-blur-md grid place-items-center text-[#8E2A4A] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_6px_18px_rgba(190,60,90,0.10)]"
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden w-11 h-11 rounded-full bg-white/70 grid place-items-center text-[#8E2A4A]"
            aria-label="menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-3 bg-white/90 backdrop-blur-md rounded-3xl px-4 py-4 shadow-lg">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActive(link.label);
                  setMobileOpen(false);
                }}
                className="block px-4 py-3 rounded-full text-[#5b1f33] hover:bg-[#F7C6CF]/60 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
