import { motion } from "framer-motion";
import React, { useMemo, useEffect, useState } from "react";

/**
 * Individual Snowflake component with randomized properties for a natural look.
 */
const Snowflake = React.memo(({ index, totalCount }: { index: number; totalCount: number }) => {
  // --- Standardized randomized properties ---
  const size = useMemo(() => Math.random() * 6 + 12, []); // 12px to 18px
  const fallDuration = useMemo(() => Math.random() * 10 + 20, []); // 20s to 30s
  const horizontalDrift = useMemo(() => Math.random() * 40 - 20, []); // -20px to 20px
  const rotationAngle = useMemo(() => Math.random() * 180 - 90, []); // -90deg to 90deg
  const maxOpacity = useMemo(() => Math.random() * 0.4 + 0.3, []); // 30% to 70%
  const animationDelay = useMemo(() => -Math.random() * fallDuration, [fallDuration]);

  // --- Even distribution logic across screen width ---
  const leftPosition = useMemo(() => {
    const sectionWidth = 100 / totalCount;
    return `${sectionWidth * index + Math.random() * sectionWidth}%`;
  }, [index, totalCount]);

  return (
    <motion.div
      className="absolute select-none pointer-events-none"
      initial={{
        top: "-10%",
        left: leftPosition,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        y: "115vh",
        x: horizontalDrift,
        rotate: rotationAngle,
        opacity: [0, maxOpacity, maxOpacity, 0],
        scale: [0.8, 1, 0.9],
      }}
      transition={{
        duration: fallDuration,
        repeat: Infinity,
        ease: "linear",
        delay: animationDelay,
      }}
      style={{
        fontSize: `${size}px`,
        color: "rgba(255, 255, 255, 0.8)",
        textShadow: "0 0 10px rgba(255, 255, 255, 0.4)",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      ❄
    </motion.div>
  );
});

Snowflake.displayName = "Snowflake";

interface SectionBubblesProps {
  count?: number;
  className?: string;
}

/**
 * Container component for atmospheric section particles.
 */
export const SectionBubbles = React.memo(
  ({ count: customCount, className = "" }: SectionBubblesProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Standardized particle volume
    const snowflakeCount = useMemo(() => {
      if (customCount) return customCount;
      return isMobile ? 6 : 16;
    }, [customCount, isMobile]);

    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-[5] ${className}`}>
        {[...Array(snowflakeCount)].map((_, i) => (
          <Snowflake key={i} index={i} totalCount={snowflakeCount} />
        ))}
      </div>
    );
  }
);

SectionBubbles.displayName = "SectionBubbles";
