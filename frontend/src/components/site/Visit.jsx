import React, { useEffect, useState } from "react";
import { Clock, MapPin, Phone, Navigation } from "lucide-react";
import { CONTACT, HOURS, HOURS_RANGES, GALLERY } from "../../mock";

const Visit = () => {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const [openNow, setOpenNow] = useState(false);
  const [closeText, setCloseText] = useState("");

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const dow = now.getDay();
      const idx = dow === 0 ? 6 : dow - 1;
      const r = HOURS_RANGES[idx];
      const t = now.getHours() + now.getMinutes() / 60;
      const open = t >= r.open && t < r.close;
      setOpenNow(open);
      if (open) {
        const remaining = r.close - t;
        const hours = Math.floor(remaining);
        const mins = Math.round((remaining - hours) * 60);
        setCloseText(
          hours > 0 ? `Zavírá za ${hours} h ${mins} min` : `Zavírá za ${mins} min`
        );
      } else if (t < r.open) {
        const opens = r.open - t;
        const hh = Math.floor(opens);
        const mm = Math.round((opens - hh) * 60);
        setCloseText(hh > 0 ? `Otevírá za ${hh} h ${mm} min` : `Otevírá za ${mm} min`);
      } else {
        setCloseText("Otevíráme zítra");
      }
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="visit"
      className="relative bg-[#EAE2D5] text-[#2a2724] py-28 md:py-40 overflow-hidden"
    >
      {/* Soft accent blob */}
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[#C46B5B]/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-[11px] tracking-[0.4em] uppercase text-[#C46B5B] font-medium mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-[#C46B5B]" />
              03 — Posezení
            </div>
            <h2 className="font-display text-[44px] md:text-[80px] leading-[0.92] font-black">
              Stavte se<br />
              pod kryté posezení.
            </h2>
          </div>

          {/* Live status pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#2a2724] text-[#F4EFE8]">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                  openNow ? "bg-emerald-400" : "bg-amber-300"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  openNow ? "bg-emerald-400" : "bg-amber-300"
                }`}
              />
            </span>
            <span className="text-[12px] font-medium">
              {openNow ? "Otevřeno teď" : "Právě zavřeno"}
            </span>
            <span className="w-px h-3.5 bg-white/20" />
            <span className="text-[11px] tracking-wide text-white/70">
              {closeText}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Hours card */}
          <div className="col-span-12 md:col-span-5 bg-white rounded-3xl p-7 md:p-9 shadow-[0_24px_60px_-12px_rgba(42,39,36,0.12)] relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#C46B5B]/8" />
            <div className="relative flex items-center gap-3 mb-7">
              <Clock className="w-5 h-5 text-[#C46B5B]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#2a2724]/60">
                Otevírací doba
              </span>
            </div>
            <ul className="relative">
              {HOURS.map((h, i) => {
                const isToday = i === todayIdx;
                return (
                  <li
                    key={h.day}
                    className={`flex items-center justify-between py-3.5 border-b border-[#2a2724]/10 last:border-0 transition-colors ${
                      isToday ? "" : "hover:text-[#C46B5B]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C46B5B] text-white text-[9px] tracking-[0.2em] uppercase font-bold">
                          Dnes
                        </span>
                      )}
                      <span
                        className={`font-display text-[16px] ${
                          isToday ? "font-bold" : ""
                        }`}
                      >
                        {h.day}
                      </span>
                    </span>
                    <span
                      className={`font-mono text-[14px] tabular-nums ${
                        isToday ? "text-[#C46B5B] font-bold" : ""
                      }`}
                    >
                      {h.time}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Map + address */}
          <div className="col-span-12 md:col-span-7 bg-[#2a2724] text-[#F4EFE8] rounded-3xl overflow-hidden flex flex-col shadow-[0_24px_60px_-12px_rgba(42,39,36,0.20)]">
            <div className="relative h-[280px] md:h-[360px] bg-[#A8A099] overflow-hidden">
              <iframe
                title="Mapa Zmrzlina Málek"
                className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[0.95]"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=15.811%2C49.911%2C15.823%2C49.918&layer=mapnik&marker=${CONTACT.coords.lat}%2C${CONTACT.coords.lng}`}
                loading="lazy"
              />
              {/* big pin overlay */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#C46B5B] grid place-items-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] animate-bounce">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-3 h-3 rotate-45 bg-[#C46B5B]" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                <a
                  href={CONTACT.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto px-4 py-2 rounded-full bg-[#F4EFE8] text-[#2a2724] text-[12px] font-medium tracking-wide hover:bg-[#C46B5B] hover:text-white transition-colors flex items-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Otevřít v mapách
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

        {/* Gallery — overlapping varied heights */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {GALLERY.map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group transition-transform duration-500 hover:-translate-y-1 ${
                [
                  "aspect-[4/5]",
                  "aspect-[3/4] md:translate-y-8",
                  "aspect-[4/5]",
                  "aspect-[3/4] md:translate-y-8",
                  "aspect-[4/5]",
                ][i % 5]
              }`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a2724]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                Slatiňany · {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Visit;
