import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVARA GT-E — The Electric Grand Tourer",
  description: "Configure, finance and book a test drive of the all-electric NOVARA GT-E.",
};

export const viewport: Viewport = {
  themeColor: "#050507",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="grain">{children}</body>
    </html>
  );
}
