import React from "react";

/**
 * SVG drip — used as a section divider to give the page a melting/iced
 * texture. Renders an irregular dripping bottom edge.
 */
const Drip = ({
  color = "#F4EFE8",
  flip = false,
  className = "",
  height = 60,
}) => {
  // Path built with bezier blobs for an organic drip silhouette
  const path =
    "M0 0 L0 30 C 60 30, 80 70, 130 50 C 170 35, 200 90, 260 70 C 310 55, 340 95, 410 80 C 470 68, 510 110, 580 88 C 640 70, 680 100, 740 85 C 800 70, 840 105, 910 90 C 970 78, 1010 100, 1080 85 C 1140 73, 1180 95, 1240 80 C 1300 65, 1340 90, 1400 80 C 1440 75, 1480 60, 1500 55 L 1500 0 Z";

  return (
    <div className={`relative w-full ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1500 120"
        preserveAspectRatio="none"
        width="100%"
        height={height}
        style={{ display: "block", transform: flip ? "scaleY(-1)" : "none" }}
      >
        <path d={path} fill={color} />
      </svg>
    </div>
  );
};

export default Drip;
