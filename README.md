# Apex Motors

Apex Motors is a premium automotive showroom experience built with Next.js, React, TypeScript, Three.js, and React Three Fiber. The project presents a fictional high-performance electric sports car, the NOVARA GT-E, through an immersive 3D shopping experience featuring scroll-driven storytelling, live configurability, dynamic pricing, finance estimation, and test-drive booking.

This project explores how modern web technologies and real-time 3D rendering can be combined to create a polished digital automotive brand experience.

---

## Overview

The experience includes:

- A real-time 3D vehicle presentation
- Scroll-based cinematic transitions
- Interactive vehicle customization
- Dynamic pricing updates
- Inventory browsing
- Finance calculator
- Test-drive booking flow
- Responsive UI across desktop, tablet, and mobile devices

---

## Features

### Interactive 3D Vehicle

The NOVARA GT-E is rendered in real time using Three.js and React Three Fiber, enabling:

- WebGL-based 3D rendering
- Camera motion and vehicle reveal transitions
- Dynamic lighting and material effects
- High-performance scene composition

### Scroll-Driven Experience

The showroom is designed as a cinematic product narrative with:

- Scroll-controlled camera movement
- Smooth section transitions
- Animated UI content
- Motion-based product reveals

### Vehicle Configurator

Users can customize the vehicle by selecting:

- Paint colours
- Wheel designs
- Performance packages
- Optional upgrades

The total price updates in real time as the configuration changes.

### Inventory

Browse available vehicles with filtering and specification-driven browsing.

### Finance Calculator

Estimate monthly payments using:

- Vehicle price
- Deposit amount
- Finance term
- APR

The estimate updates instantly as inputs change.

### Test Drive Booking

Users can submit a test-drive request from a booking form with confirmation states.

### Responsive Design

The interface and 3D experience are optimized to work across:

- Desktop
- Laptop
- Tablet
- Mobile

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js | Application framework |
| React | UI development |
| TypeScript | Type-safe frontend development |
| Three.js | 3D rendering and WebGL graphics |
| React Three Fiber | React integration for Three.js |
| Drei | Utility components for Three.js and R3F |
| Tailwind CSS | Styling and responsiveness |
| Framer Motion | UI animation and transitions |
| @react-three/postprocessing | Visual effects such as bloom and vignette |
| Lenis | Smooth scrolling |

---

## Project Structure

- `src/components/three/Car.tsx` — procedural 3D car model and silhouette logic
- `src/components/three/Scene.tsx` — lighting, floor, and scroll-driven camera animation data
- `src/components/Sections.tsx` — page sections including hero, engineering, configurator, inventory, finance, and booking views
- `src/lib/store.ts` — shared color and wheel configuration data used by the UI and 3D model

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the project

```bash
cd apex-motors
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
npm start
```

---

## Customization

To swap in a real vehicle model, place a `.glb` file in `public/` and replace the current `<Car />` usage in `Scene.tsx` with `useGLTF("/your-car.glb")`. Keep the paint material logic so the color picker remains functional.

---

## Disclaimer

Apex Motors and the NOVARA GT-E are fictional concepts created for demonstration and portfolio purposes. This project is not affiliated with or endorsed by any real automotive manufacturer, dealership, or brand.

---

## Author

Developed by Ravindu Dilruk.

This project is intended as a demonstration of modern frontend development, 3D web experiences, and premium automotive product storytelling.

---

If you like the project, consider giving the repository a star.
