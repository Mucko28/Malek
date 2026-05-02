import React from "react";
import { IceCream2, Instagram, Twitter, Facebook } from "lucide-react";
import { BRAND, NAV_LINKS } from "../../mock";

const Footer = () => {
  return (
    <footer className="bg-[#5b1f33] text-[#FBE4EA] pt-20 pb-10">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FBE4EA] grid place-items-center">
                <IceCream2 className="w-6 h-6 text-[#8E2A4A]" strokeWidth={2.2} />
              </div>
              <div className="font-display">
                <div className="text-xl font-extrabold text-white">
                  {BRAND.short} <span className="text-[#F7C6CF]">CO.</span>
                </div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-[#FBE4EA]/70 leading-relaxed">
              Small-batch ice cream, churned with care in our kitchen since
              2014. Real ingredients, no shortcuts — just bliss in a cone.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#8E2A4A] grid place-items-center transition-colors"
                  aria-label="social"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white font-display font-bold mb-5">Menu</div>
            <ul className="space-y-3 text-[#FBE4EA]/75">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-white font-display font-bold mb-5">Visit</div>
            <ul className="space-y-3 text-[#FBE4EA]/75">
              <li>Mon – Fri · 11am – 9pm</li>
              <li>Sat – Sun · 10am – 11pm</li>
              <li>221 Sugar Lane</li>
              <li>Brookline, MA</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#FBE4EA]/60">
          <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a className="hover:text-white" href="#">Privacy</a>
            <a className="hover:text-white" href="#">Terms</a>
            <a className="hover:text-white" href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
