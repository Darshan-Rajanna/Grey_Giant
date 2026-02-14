import { motion } from "framer-motion";
import React, { useMemo, useEffect, useState } from "react";

/**
 * Individual Snowflake
 */
const Snowflake = React.memo(
  ({ index, totalCount, isMobile }: { index: number; totalCount: number; isMobile: boolean }) => {

    const size = useMemo(() => Math.random() * 6 + 12, []);
    const fallDuration = useMemo(() => Math.random() * 10 + 22, []);
    const maxOpacity = useMemo(() => Math.random() * 0.4 + 0.3, []);
    const rotationAngle = useMemo(() => Math.random() * 120 - 60, []);
    const animationDelay = useMemo(() => -Math.random() * fallDuration, [fallDuration]);

    /**
     * ✅ Strict Even Distribution (No Jitter Needed)
     * Each flake gets exact center of its segment.
     */
    const leftPosition = useMemo(() => {
      const segmentWidth = 100 / totalCount;
      return `${index * segmentWidth + segmentWidth / 2}%`;
    }, [index, totalCount]);

    /**
     * ✅ Symmetric Wave Drift (No One-Side Bias)
     */
    const waveDistance = isMobile ? 10 : 20;

    return (
      <motion.div
        className="absolute select-none pointer-events-none"
        initial={{
          top: "-10%",
          left: leftPosition,
          opacity: 0,
          scale: 0.85,
          x: "-50%", // center the flake properly
        }}
        animate={{
          y: "115vh",
          x: ["-50%", `calc(-50% + ${waveDistance}px)`, "-50%"],
          rotate: rotationAngle,
          opacity: [0, maxOpacity, maxOpacity, 0],
          scale: [0.85, 1, 0.9],
        }}
        transition={{
          duration: fallDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: animationDelay,
        }}
        style={{
          fontSize: `${size}px`,
          color: "rgba(255, 255, 255, 0.85)",
          textShadow: "0 0 10px rgba(255, 255, 255, 0.4)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        ❄
      </motion.div>
    );
  }
);

Snowflake.displayName = "Snowflake";

interface SectionBubblesProps {
  count?: number;
  className?: string;
}

/**
 * Container
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

    const snowflakeCount = useMemo(() => {
      if (customCount) return customCount;
      return isMobile ? 6 : 14;
    }, [customCount, isMobile]);

    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-[5] ${className}`}>
        {[...Array(snowflakeCount)].map((_, i) => (
          <Snowflake
            key={i}
            index={i}
            totalCount={snowflakeCount}
            isMobile={isMobile}
          />
        ))}
      </div>
    );
  }
);

SectionBubbles.displayName = "SectionBubbles";
