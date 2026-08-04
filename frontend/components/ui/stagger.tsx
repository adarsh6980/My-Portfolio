"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export function StaggerGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={container}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "li";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag variants={item} className={className}>
      {children}
    </MotionTag>
  );
}
