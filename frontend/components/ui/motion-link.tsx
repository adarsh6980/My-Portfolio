"use client";

import { HTMLMotionProps, motion } from "framer-motion";

export function MotionLink(props: HTMLMotionProps<"a">) {
  return <motion.a whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} {...props} />;
}
