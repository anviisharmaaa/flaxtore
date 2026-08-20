"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { staggerContainer, staggerItem } from "./variants";

type StaggerProps = HTMLMotionProps<"div"> & {
  gap?: number;
  delayChildren?: number;
  once?: boolean;
};

export function Stagger({
  gap = 0.09,
  delayChildren = 0,
  once = true,
  children,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.15 }}
      variants={staggerContainer(gap, delayChildren)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={reduceMotion ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : staggerItem}
      {...props}
    >
      {children}
    </motion.div>
  );
}
