import React from "react";

/**
 * Endless horizontal marquee strip used between sections to add character.
 * Two duplicated rows of items animate at different speeds for parallax.
 */
const Marquee = ({
  items = [],
  bg = "#2a2724",
  fg = "#F4EFE8",
  accent = "#C46B5B",
  speed = 38,
}) => {
  const Row = ({ direction = "left", duration }) => (
    <div
      className="flex w-max gap-12 py-3"
      style={{
        animation: `marquee-${direction} ${duration}s linear infinite`,
      }}
    >
      {[...items, ...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="font-display text-[44px] md:text-[64px] font-black tracking-tight leading-none">
            {item}
          </span>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            className="shrink-0 opacity-90"
          >
            <path
              d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"
              fill={accent}
            />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative overflow-hidden border-y"
      style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
    >
      <Row direction="left" duration={speed} />
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
