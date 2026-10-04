"use client";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useMemo, useState, type FormEvent } from "react";
import { carStore, PAINTS, RIMS, useCar } from "@/lib/store";
import { Counter, Magnetic, Reveal, SplitText, Tween, usd } from "./ui";

const BASE_PRICE = 189000;

function useGo() {
  const lenis = useLenis();
  return (id: string) => lenis?.scrollTo(id, { offset: 0, duration: 1.6 });
}

/* ------------------------------ NAV ------------------------------ */
export function Nav() {
  const go = useGo();
  const { scrollYProgress } = useScroll();
  const [open, setOpen] = useState(false);
  const links = [
    ["Design", "#design"],
    ["Configure", "#configure"],
    ["Inventory", "#inventory"],
    ["Finance", "#finance"],
  ];
  return (
    <>
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-accent" />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-6xl items-center justify-between rounded-full px-5 py-3 glass"
      >
        <button onClick={() => go("#top")} className="font-display text-sm font-bold tracking-[0.25em]">
          NOVARA<span className="text-accent">.</span>
        </button>
        <nav className="hidden gap-8 text-sm text-white/70 md:flex">
          {links.map(([l, h]) => (
            <button key={h} onClick={() => go(h)} className="group relative transition hover:text-white">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => go("#test-drive")} className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black transition hover:shadow-[0_0_30px_rgba(198,255,61,0.6)]">
            Test drive
          </button>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 md:hidden">
            <span className="block h-px w-4 bg-white shadow-[0_5px_0_white,0_-5px_0_white]" />
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-20 z-50 flex flex-col gap-1 rounded-3xl p-3 glass md:hidden"
          >
            {links.map(([l, h]) => (
              <button key={h} onClick={() => { setOpen(false); go(h); }} className="rounded-2xl px-4 py-3 text-left hover:bg-white/5">
                {l}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------ HERO ------------------------------ */
export function Hero() {
  const go = useGo();
  const { scrollY } = useScroll();
  const bigY = useTransform(scrollY, [0, 800], [0, 220]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  return (
    <section id="top" className="relative flex h-svh flex-col justify-between overflow-hidden px-4 pb-8 pt-28 md:px-10">
      <motion.div style={{ opacity: fade }} className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> 2027 model year · Now taking orders
          </motion.p>
          <h1 className="font-display text-4xl font-bold leading-[0.95] md:text-7xl">
            <SplitText text="Pure electric." delay={2.1} />
            <br />
            <SplitText text="Pure adrenaline." delay={2.3} className="text-accent" />
          </h1>
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.6, duration: 0.8 }} className="flex gap-6 md:flex-col md:items-end md:gap-4 md:text-right">
          {[
            ["2.9s", "0–100 km/h"],
            ["820", "horsepower"],
            ["640km", "WLTP range"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-xl font-semibold md:text-2xl">{v}</div>
              <div className="text-xs uppercase tracking-widest text-white/40">{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: bigY }}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[18%] z-0 select-none text-center font-display text-[28vw] font-black leading-none text-outline md:bottom-[8%] md:text-[22vw]"
      >
        GT-E
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/40">Starting from</div>
          <div className="font-display text-3xl font-semibold">{usd(BASE_PRICE)}</div>
        </div>
        <div className="flex gap-3">
          <Magnetic onClick={() => go("#configure")} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
            Build yours →
          </Magnetic>
          <Magnetic onClick={() => go("#test-drive")} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold backdrop-blur">
            Book a drive
          </Magnetic>
        </div>
        <div className="hidden items-center gap-3 text-xs text-white/40 md:flex">
          <span className="relative h-10 w-6 rounded-full border border-white/25">
            <motion.span animate={{ y: [4, 18, 4] }} transition={{ repeat: Infinity, duration: 1.8 }} className="absolute left-1/2 top-0 h-2 w-1 -translate-x-1/2 rounded-full bg-accent" />
          </span>
          Scroll to explore
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------------------- MARQUEE ---------------------------- */
export function Marquee() {
  const words = ["Dual-motor AWD", "Carbon monocoque", "Active aero", "800V architecture", "Torque vectoring", "350 kW charging"];
  return (
    <div className="relative z-10 -rotate-1 border-y border-white/10 bg-accent py-3 text-black">
      <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-lg font-bold uppercase">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            {w} <span>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- ENGINEERING --------------------------- */
export function Engineering() {
  const feats = [
    ["01", "Aero-sculpted body", "A drag coefficient of 0.21 thanks to an active rear lip and sealed underbody."],
    ["02", "Dual-motor torque vectoring", "Each axle reacts in 10 ms, putting all 820 hp onto the tarmac."],
    ["03", "18-minute fast charge", "800V architecture adds 400 km of range in less time than a coffee stop."],
  ];
  return (
    <section id="design" className="relative z-10 flex min-h-svh items-center px-4 py-24 md:px-10">
      <div className="max-w-xl">
        <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">Engineering</p>
        </Reveal>
        <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
          <SplitText text="Sculpted by air." />
          <br />
          <SplitText text="Driven by lightning." className="text-white/40" delay={0.2} />
        </h2>
        <div className="mt-10 max-w-md space-y-6">
          {feats.map(([n, t, d], i) => (
            <Reveal key={n} delay={0.1 * i}>
              <div className="group flex gap-5 rounded-2xl border border-white/5 bg-ink/40 p-4 backdrop-blur-md transition hover:border-accent/40">
                <span className="font-display text-sm text-accent">{n}</span>
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1 text-sm text-white/50">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- CONFIGURATOR --------------------------- */
export function Configurator() {
  const { paint, rim } = useCar();
  const go = useGo();
  const [pack, setPack] = useState<Record<string, boolean>>({ track: false, sound: true });
  const packs = [
    { id: "track", name: "Track Pack", desc: "Carbon brakes, semi-slicks", price: 12500 },
    { id: "sound", name: "Studio Sound", desc: "21 speakers, 1,800 W", price: 3900 },
  ];
  const total =
    BASE_PRICE + PAINTS[paint].price + RIMS[rim].price + packs.reduce((s, p) => s + (pack[p.id] ? p.price : 0), 0);

  return (
    <section id="configure" className="relative z-10 flex min-h-svh items-center justify-end px-4 py-24 md:px-10">
      <Reveal className="w-full max-w-md">
        <div className="rounded-3xl p-6 glass md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Configurator</p>
          <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">Make it yours.</h2>

          <div className="mt-6">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-white/50">Paint</span>
              <span>
                {PAINTS[paint].name} <span className="text-white/40">{PAINTS[paint].price ? "+" + usd(PAINTS[paint].price) : "Included"}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {PAINTS.map((p, i) => (
                <button
                  key={p.name}
                  aria-label={p.name}
                  onClick={() => carStore.set({ paint: i })}
                  className="relative h-10 w-10 rounded-full transition hover:scale-110"
                  style={{ background: `radial-gradient(circle at 30% 30%, #ffffff55, ${p.hex} 45%)` }}
                >
                  {paint === i && <motion.span layoutId="paint-ring" className="absolute -inset-1.5 rounded-full border-2 border-accent" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 text-sm text-white/50">Wheels</div>
            <div className="grid grid-cols-3 gap-2">
              {RIMS.map((r, i) => (
                <button
                  key={r.name}
                  onClick={() => carStore.set({ rim: i })}
                  className={`relative rounded-xl border px-2 py-3 text-xs transition ${rim === i ? "border-accent text-white" : "border-white/10 text-white/60 hover:border-white/30"}`}
                >
                  <span className="mx-auto mb-2 block h-5 w-5 rounded-full border-2 border-white/20" style={{ background: r.hex }} />
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {packs.map((p) => (
              <button
                key={p.id}
                onClick={() => setPack((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left transition hover:border-white/30"
              >
                <span>
                  <span className="block text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-white/40">{p.desc} · +{usd(p.price)}</span>
                </span>
                <span className={`relative h-6 w-11 rounded-full transition ${pack[p.id] ? "bg-accent" : "bg-white/15"}`}>
                  <motion.span layout className={`absolute top-1 h-4 w-4 rounded-full bg-white ${pack[p.id] ? "right-1" : "left-1"}`} />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/40">Your GT-E</div>
              <div className="font-display text-2xl font-semibold text-accent">
                <Tween value={total} format={usd} />
              </div>
            </div>
            <Magnetic onClick={() => go("#test-drive")} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
              Reserve
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------- INVENTORY ---------------------------- */
type Car = { name: string; type: "Electric" | "Hybrid" | "Performance"; price: number; year: number; km: number; hp: number; color: string };
const CARS: Car[] = [
  { name: "GT-E Launch Edition", type: "Electric", price: 214000, year: 2027, km: 0, hp: 820, color: "#c6ff3d" },
  { name: "Volta S Coupé", type: "Electric", price: 96500, year: 2026, km: 3200, hp: 480, color: "#3dd8ff" },
  { name: "Strada RS", type: "Performance", price: 142000, year: 2025, km: 8900, hp: 640, color: "#ff3b3b" },
  { name: "Aurea Hybrid GT", type: "Hybrid", price: 78900, year: 2026, km: 1500, hp: 390, color: "#f2c14e" },
  { name: "Nero Track Spec", type: "Performance", price: 189500, year: 2026, km: 600, hp: 720, color: "#b18cff" },
  { name: "Lumen Tourer", type: "Hybrid", price: 64200, year: 2025, km: 12400, hp: 340, color: "#ff8a3d" },
];

function Silhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 80" className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]">
      <defs>
        <linearGradient id={`g${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="70" rx="95" ry="5" fill="black" opacity="0.6" />
      <path d="M12 58 Q8 46 22 42 L62 36 Q86 16 118 15 L134 15 Q160 18 176 34 L200 40 Q212 44 208 58 Z" fill={`url(#g${color})`} />
      <path d="M70 36 Q90 21 118 20 L132 20 Q152 22 164 34 Z" fill="#0b0b10" opacity="0.85" />
      <path d="M200 44 L208 46" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      {[58, 168].map((x) => (
        <g key={x}>
          <circle cx={x} cy="58" r="13" fill="#0a0a0a" />
          <circle cx={x} cy="58" r="7" fill="#2a2a30" stroke={color} strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

function TiltCard({ car }: { car: Car }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 16);
        rx.set(-(py - 0.5) * 16);
        setGlow({ x: px * 100, y: py * 100 });
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-panel p-5 [transform-style:preserve-3d]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(400px circle at ${glow.x}% ${glow.y}%, ${car.color}22, transparent 60%)` }}
      />
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-white/60">{car.type}</span>
        <span className="text-white/40">{car.year}</span>
      </div>
      <div className="my-6 transition-transform duration-500 [transform:translateZ(50px)] group-hover:scale-105">
        <Silhouette color={car.color} />
      </div>
      <h3 className="font-display text-lg font-semibold [transform:translateZ(30px)]">{car.name}</h3>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/50">
        <div><div className="text-sm text-white">{car.hp}</div>hp</div>
        <div><div className="text-sm text-white">{car.km.toLocaleString()}</div>km</div>
        <div><div className="text-sm text-white">{car.year}</div>year</div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-display text-xl font-semibold">{usd(car.price)}</span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/5 transition group-hover:bg-accent group-hover:text-black">→</span>
      </div>
    </motion.article>
  );
}

export function Inventory() {
  const [filter, setFilter] = useState<"All" | Car["type"]>("All");
  const list = useMemo(() => CARS.filter((c) => filter === "All" || c.type === filter), [filter]);
  return (
    <section id="inventory" className="relative z-20 bg-ink px-4 pb-24 pt-32 md:px-10">
      <div className="pointer-events-none absolute inset-x-0 -top-64 h-64 bg-gradient-to-b from-transparent to-ink" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal><p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">In stock now</p></Reveal>
            <h2 className="font-display text-3xl font-bold md:text-5xl"><SplitText text="The showroom floor." /></h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", "Electric", "Hybrid", "Performance"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className="relative rounded-full px-4 py-2 text-sm">
                {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <span className={`relative ${filter === f ? "text-black" : "text-white/60"}`}>{f}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <TiltCard key={c.name} car={c} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ STATS ------------------------------ */
export function Stats() {
  const stats = [
    { to: 2.9, d: 1, suffix: "s", label: "0–100 km/h" },
    { to: 322, suffix: " km/h", label: "Top speed" },
    { to: 640, suffix: " km", label: "Range (WLTP)" },
    { to: 1200, suffix: " Nm", label: "Instant torque" },
  ];
  return (
    <section className="relative z-20 bg-ink px-4 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-ink p-6 md:p-10">
            <div className="font-display text-3xl font-bold text-accent md:text-5xl">
              <Counter to={s.to} decimals={s.d ?? 0} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-white/40">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- FINANCE ----------------------------- */
function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt: (v: number) => string }) {
  return (
    <label className="block">
      <div className="mb-3 flex justify-between text-sm">
        <span className="text-white/50">{label}</span>
        <span className="font-medium">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ ["--fill" as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </label>
  );
}

export function Finance() {
  const [price, setPrice] = useState(189000);
  const [down, setDown] = useState(20);
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(4.9);
  const principal = price * (1 - down / 100);
  const r = rate / 100 / 12;
  const monthly = r === 0 ? principal / term : (principal * r) / (1 - Math.pow(1 + r, -term));
  const totalInterest = monthly * term - principal;

  return (
    <section id="finance" className="relative z-20 bg-ink px-4 py-24 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <Reveal><p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">Finance</p></Reveal>
          <h2 className="font-display text-3xl font-bold md:text-5xl"><SplitText text="Drive now." /><br /><SplitText text="Pay smarter." className="text-white/40" delay={0.15} /></h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-white/50">Tune the numbers and see your monthly payment update instantly. Final rates depend on approval — this is an estimate.</p>
          </Reveal>
        </div>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-panel p-6 md:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative space-y-7">
              <Slider label="Vehicle price" value={price} min={50000} max={300000} step={1000} onChange={setPrice} fmt={usd} />
              <Slider label="Down payment" value={down} min={0} max={60} step={5} onChange={setDown} fmt={(v) => `${v}% · ${usd(price * v / 100)}`} />
              <Slider label="Term" value={term} min={12} max={84} step={12} onChange={setTerm} fmt={(v) => `${v} months`} />
              <Slider label="APR" value={rate} min={0} max={12} step={0.1} onChange={setRate} fmt={(v) => `${v.toFixed(1)}%`} />
              <div className="flex items-end justify-between border-t border-white/10 pt-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40">Monthly</div>
                  <div className="font-display text-4xl font-bold text-accent"><Tween value={monthly} format={usd} /></div>
                </div>
                <div className="text-right text-xs text-white/40">
                  Total interest<br />
                  <span className="text-sm text-white"><Tween value={totalInterest} format={usd} /></span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- TEST DRIVE ---------------------------- */
export function TestDrive() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  const input = "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-accent focus:bg-white/[0.06]";
  return (
    <section id="test-drive" className="relative z-20 overflow-hidden bg-ink px-4 py-24 md:px-10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold md:text-7xl"><SplitText text="Feel it" /> <SplitText text="yourself." className="text-accent" delay={0.15} /></h2>
        <Reveal delay={0.2}><p className="mx-auto mt-5 max-w-md text-white/50">Book a 45-minute test drive at your nearest NOVARA studio. We&apos;ll bring the car to you if you prefer.</p></Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 rounded-3xl p-6 text-left glass md:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent text-2xl text-black">✓</motion.div>
                  <h3 className="font-display text-2xl font-semibold">You&apos;re on the grid.</h3>
                  <p className="mt-2 text-white/50">A product specialist will confirm your slot within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                  <input required className={input} placeholder="Full name" />
                  <input required type="email" className={input} placeholder="Email" />
                  <input className={input} placeholder="Phone" />
                  <select className={input} defaultValue="GT-E">
                    {["GT-E", ...CARS.map((c) => c.name)].map((n) => <option key={n} className="bg-ink">{n}</option>)}
                  </select>
                  <input type="date" className={`${input} md:col-span-2`} />
                  <Magnetic type="submit" className="rounded-xl bg-accent py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:shadow-[0_0_40px_rgba(198,255,61,0.5)] md:col-span-2">
                    Book my test drive
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
export function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-ink px-4 pb-8 pt-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="select-none font-display text-[18vw] font-black leading-none text-outline md:text-[13vw]">NOVARA</div>
        <div className="mt-8 flex flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} NOVARA Motors. A demo concept site.</span>
          <div className="flex gap-6">
            {["Instagram", "YouTube", "Privacy"].map((l) => <a key={l} href="#" className="transition hover:text-accent">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
