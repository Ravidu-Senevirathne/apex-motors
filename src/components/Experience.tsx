"use client";
import dynamic from "next/dynamic";
import { CursorGlow, Preloader, SmoothScroll } from "./ui";
import { Configurator, Engineering, Finance, Footer, Hero, Inventory, Marquee, Nav, Stats, TestDrive } from "./Sections";

// WebGL only runs in the browser
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

export default function Experience() {
  return (
    <SmoothScroll>
      <Preloader />
      <Scene />
      <CursorGlow />
      <Nav />
      <main className="relative">
        <Hero />
        <Engineering />
        <Configurator />
        <Inventory />
        <Marquee />
        <Stats />
        <Finance />
        <TestDrive />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
