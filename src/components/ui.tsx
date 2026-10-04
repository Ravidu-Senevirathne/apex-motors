"use client";
import { ReactLenis } from "lenis/react";
import { animate, motion, useInView, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

/* Fade + blur + rise when scrolled into view */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Per-character rise for big headlines (observer sits on the visible wrapper) */
export function SplitText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  let i = 0;
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ delayChildren: delay, staggerChildren: 0.025 }}
    >
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          {word.split("").map((c) => (
            <motion.span
              key={i++}
              className="inline-block"
              variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {c}
            </motion.span>
          ))}
          {wi < arr.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/* Animated number that counts up when visible */
export function Counter({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const ctrl = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      },
    });
    return () => ctrl.stop();
  }, [inView, to, decimals, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* Smoothly tweened number (for live prices) */
export function Tween({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const ctrl = animate(prev.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => ref.current && (ref.current.textContent = format(v)),
    });
    prev.current = value;
    return () => ctrl.stop();
  }, [value, format]);
  return <span ref={ref}>{format(value)}</span>;
}

/* Button that leans toward the cursor */
export function Magnetic({ children, className = "", onClick, type = "button" }: { children: ReactNode; className?: string; onClick?: () => void; type?: "button" | "submit" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.button
      type={type}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* Soft glow that follows the cursor (desktop only) */
export function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });
  useEffect(() => {
    const m = (e: PointerEvent) => {
      x.set(e.clientX - 200);
      y.set(e.clientY - 200);
    };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px] md:block"
    />
  );
}

/* Intro loader */
export function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const ctrl = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setTimeout(() => setDone(true), 250),
    });
    return () => ctrl.stop();
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="font-display text-sm tracking-[0.3em] text-white/50">NOVARA</div>
          <div className="flex items-end justify-between">
            <div className="max-w-xs text-sm text-white/40">Warming up the studio lights…</div>
            <div className="font-display text-7xl font-bold tabular-nums text-accent md:text-[10rem]">{n}</div>
          </div>
          <div className="h-px w-full bg-white/10">
            <div className="h-px bg-accent" style={{ width: `${n}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
