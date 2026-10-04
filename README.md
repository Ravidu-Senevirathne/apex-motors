# NOVARA GT-E — 3D car showroom (Next.js)

Single-page car sales site with a real-time 3D car, scroll-driven camera, live paint/wheel configurator, inventory, finance calculator and test-drive booking.

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Stack
- **Next.js 16** (App Router, TypeScript, Turbopack) + **React 19**
- **Tailwind CSS v4**
- **three.js + React Three Fiber + drei** — procedural car (no model files), studio Lightformer environment, reflective floor, contact shadows
- **@react-three/postprocessing** — bloom on light bars, vignette
- **Motion** (Framer Motion) — split-text reveals, layout animations, 3D tilt cards, magnetic buttons, animated counters
- **Lenis** — smooth scrolling

## Where things live
- `src/components/three/Car.tsx` — the 3D car (body/glass are extruded shapes; edit the `makeBody()` profile to change its silhouette)
- `src/components/three/Scene.tsx` — lights, floor, and the `KEYS` array that drives the camera per scroll section
- `src/components/Sections.tsx` — all page sections (hero, engineering, configurator, inventory, stats, finance, test drive, footer)
- `src/lib/store.ts` — paint & wheel options/prices shared between the UI and 3D car

## Swap in a real car model
Drop a `.glb` in `public/` and replace `<Car />` in `Scene.tsx` with drei's `useGLTF("/your-car.glb")`. Keep the paint material logic to retain the colour picker.

Note: brand, models and figures are fictional placeholders, and the booking form has no backend wired yet.
