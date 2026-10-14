"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const markReady = () => setReady(true);
    window.addEventListener("load", markReady);
    const timeout = setTimeout(() => setReady(true), 2400);

    return () => {
      window.removeEventListener("load", markReady);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const speed = ready ? 18 : 38;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const cap = ready ? 100 : 92;
        const next = Math.min(prev + Math.ceil(Math.random() * 7), cap);
        return next;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [ready]);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
  }, [progress, onDone]);

  const percent = useMemo(() => `${progress}%`, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[var(--bg)]"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 3.2 }}
        className="mb-8 h-16 w-16 rounded-full border-2 border-[var(--accent)] border-t-transparent"
      />
      <p className="text-4xl font-bold text-[var(--text)]">{percent}</p>
      <div className="mt-6 h-1 w-64 overflow-hidden rounded-full bg-white/15">
        <motion.div
          className="h-full bg-[var(--accent)]"
          animate={{ width: percent }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>
    </motion.div>
  );
}
