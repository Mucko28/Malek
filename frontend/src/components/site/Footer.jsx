import React from "react";
import { Phone, Mail, MapPin, ArrowUpRight, Instagram, Facebook } from "lucide-react";
import { CONTACT, BRAND } from "../../mock";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="relative bg-[#1a1816] text-[#F4EFE8] pt-28 pb-10 overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="grid grid-cols-12 gap-8 md:gap-12 mb-20">
          <div className="col-span-12 md:col-span-7">
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5">
              05 — Kontakt
            </div>
            <h2 className="font-display text-[52px] md:text-[100px] leading-[0.9] font-black tracking-tight">
              Jak nás<br />kontaktovat.
            </h2>
            <p className="mt-8 max-w-[44ch] text-[16px] leading-[1.7] text-white/65">
              Ozvěte se s dotazem, nápadem na novou příchuť nebo si rovnou
              naplánujte zastávku ve Slatiňanech.
            </p>
          </div>

          <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
            {[
              {
                Icon: MapPin,
                label: "Adresa",
                value: CONTACT.address,
                href: CONTACT.mapUrl,
              },
              {
                Icon: Phone,
                label: "Telefon",
                value: CONTACT.phoneDisplay,
                href: `tel:${CONTACT.phone}`,
              },
              {
                Icon: Mail,
                label: "E-mail",
                value: CONTACT.email,
                href: `mailto:${CONTACT.email}`,
              },
              {
                Icon: Instagram,
                label: "Instagram",
                value: "@zmrzlinamalekslatinany",
                href: CONTACT.instagram,
              },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between gap-5 p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#C46B5B] grid place-items-center text-white shrink-0">
                    <c.Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">
                      {c.label}
                    </div>
                    <div className="font-display text-[15px] truncate">
                      {c.value}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#C46B5B] group-hover:rotate-12 transition-all" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-10 border-t border-white/10">
          <div>
            <div className="font-display font-black text-[32px] leading-none">
              {BRAND.name}
            </div>
            <div className="mt-2 text-[11px] tracking-[0.3em] uppercase text-white/50">
              {BRAND.city} · Česká republika
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, href: CONTACT.instagram },
              {
                Icon: Facebook,
                href: CONTACT.facebook,
              },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-white/5 ring-1 ring-white/10 grid place-items-center hover:bg-[#C46B5B] hover:ring-[#C46B5B] transition-colors"
              >
                <s.Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] tracking-[0.2em] uppercase text-white/40">
          <div>© {new Date().getFullYear()} {BRAND.name}. Všechna práva vyhrazena.</div>
          <div>Provozovatel: Martin Málek</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
