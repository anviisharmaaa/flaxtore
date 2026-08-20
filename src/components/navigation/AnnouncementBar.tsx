"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { announcementMessages } from "@/config/site";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % announcementMessages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-9 items-center justify-center overflow-hidden bg-brand-900 px-4 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-100"
        >
          {announcementMessages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
