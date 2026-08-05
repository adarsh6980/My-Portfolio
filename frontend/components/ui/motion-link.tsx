"use client";

import { HTMLMotionProps, motion } from "framer-motion";

export function MotionLink(props: HTMLMotionProps<"a">) {
  return (
    <motion.a
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.5 }}
      {...props}
    />
  );
}
