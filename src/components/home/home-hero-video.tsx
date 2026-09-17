"use client";

import { useEffect, useState } from "react";

export function HomeHeroVideo() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <video
      className="home-hero-video absolute inset-0 h-full w-full object-cover object-right"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/videos/home-hero.mp4?v=hd720" type="video/mp4" />
    </video>
  );
}
