import React from "react";
import { Clock, MapPin, Phone, Cloud } from "lucide-react";
import { CONTACT, HOURS, GALLERY } from "../../mock";

const Visit = () => {
  const today = new Date().getDay(); // 0=Sun..6=Sat -> our list starts Mon
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <section
      id="visit"
      className="relative bg-[#F4EFE8] text-[#2a2724] py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5">
          03 — Posezení
        </div>
        <h2 className="font-display text-[44px] md:text-[72px] leading-[0.95] font-black mb-12">
          Stavíme se<br />pod krytým posezením.
        </h2>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Hours */}
          <div className="col-span-12 md:col-span-5 bg-white rounded-3xl p-7 md:p-9 shadow-[0_20px_50px_rgba(42,39,36,0.06)]">
            <div className="flex items-center gap-3 mb-7">
              <Clock className="w-5 h-5 text-[#C46B5B]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#2a2724]/60">
                Otevírací doba
              </span>
            </div>
            <ul>
              {HOURS.map((h, i) => {
                const isToday = i === todayIdx;
                return (
                  <li
                    key={h.day}
                    className={
                      "flex items-baseline justify-between py-3 border-b border-[#2a2724]/10 last:border-0 " +
                      (isToday ? "text-[#C46B5B] font-semibold" : "")
                    }
                  >
                    <span className="font-display text-[16px]">{h.day}</span>
                    <span className="font-mono text-[14px] tabular-nums">
                      {h.time}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex items-start gap-3 text-[13px] text-[#2a2724]/70 leading-relaxed">
              <Cloud className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                I když venku prší, točíme dál — ve vinotece je vždy sucho
                a příjemně.
              </span>
            </div>
          </div>

          {/* Map + address */}
          <div className="col-span-12 md:col-span-7 bg-[#2a2724] text-[#F4EFE8] rounded-3xl overflow-hidden flex flex-col">
            <div className="relative h-[280px] md:h-[360px] bg-[#A8A099]">
              <iframe
                title="Mapa Zmrzlina Málek"
                className="absolute inset-0 w-full h-full grayscale-[0.3] contrast-[0.95] mix-blend-luminosity"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=15.811%2C49.911%2C15.823%2C49.918&layer=mapnik&marker=${CONTACT.coords.lat}%2C${CONTACT.coords.lng}`}
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                <a
                  href={CONTACT.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto px-4 py-2 rounded-full bg-[#F4EFE8] text-[#2a2724] text-[12px] font-medium tracking-wide hover:bg-[#C46B5B] hover:text-white transition-colors"
                >
                  Otevřít v mapách →
                </a>
              </div>
            </div>
            <div className="p-7 md:p-9 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-white/55">
                  <MapPin className="w-3.5 h-3.5" /> Adresa
                </div>
                <div className="mt-2 font-display text-[18px] leading-snug">
                  {CONTACT.address}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-white/55">
                  <Phone className="w-3.5 h-3.5" /> Telefon
                </div>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="mt-2 font-display text-[18px] hover:text-[#C46B5B] transition-colors block"
                >
                  {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {GALLERY.map((src, i) => (
            <div
              key={i}
              className={
                "relative overflow-hidden rounded-2xl aspect-[4/5] group " +
                (i === 1 ? "md:translate-y-6" : i === 3 ? "md:translate-y-6" : "")
              }
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Visit;
