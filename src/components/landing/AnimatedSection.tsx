"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
