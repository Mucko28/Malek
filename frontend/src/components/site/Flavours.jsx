import React, { useState } from "react";
import { Plus, Star } from "lucide-react";
import { FLAVOURS } from "../../mock";
import { useToast } from "../../hooks/use-toast";

const Flavours = () => {
  const [hovered, setHovered] = useState(null);
  const { toast } = useToast();

  return (
    <section id="flavours" className="relative bg-[#FBE4EA] py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full text-[#8E2A4A] text-xs tracking-[0.25em] uppercase font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#8E2A4A] text-[#8E2A4A]" />
              Our Flavours
            </div>
            <h2 className="font-display mt-5 text-[42px] md:text-[64px] leading-[0.95] font-extrabold text-[#5b1f33]">
              A scoop for <br />
              every craving.
            </h2>
          </div>
          <p className="max-w-md text-[#5b1f33]/75 text-[15px] leading-relaxed">
            Hand-churned in micro-batches with seasonal fruit, single-origin
            cocoa, and pure dairy. New flavours drop every month.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {FLAVOURS.map((f) => (
            <article
              key={f.id}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative bg-white rounded-[28px] p-6 pt-24 shadow-[0_10px_30px_rgba(190,60,90,0.08)] hover:shadow-[0_20px_50px_rgba(190,60,90,0.18)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div
                className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-30 blur-2xl transition-all duration-500 group-hover:opacity-60"
                style={{ background: f.accent }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full overflow-hidden ring-8 ring-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-16 text-center">
                <div className="text-xs tracking-[0.2em] uppercase text-[#8E2A4A]/70 font-semibold">
                  {f.note}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#5b1f33] mt-1">
                  {f.name}
                </h3>
                <div className="mt-4 flex items-center justify-between bg-[#FBE4EA] rounded-full pl-5 pr-1.5 py-1.5">
                  <span className="font-display text-xl font-bold text-[#8E2A4A]">
                    {f.price}
                  </span>
                  <button
                    onClick={() =>
                      toast({
                        title: "Added to cart",
                        description: `${f.name} — ${f.price}`,
                      })
                    }
                    className="w-10 h-10 rounded-full bg-[#8E2A4A] hover:bg-[#7a2440] text-white grid place-items-center transition-all duration-300 hover:rotate-90"
                    aria-label={`Add ${f.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Flavours;
