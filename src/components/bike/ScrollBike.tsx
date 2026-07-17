"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BikeSvg } from "./BikeSvg";
import { useBike } from "./BikeContext";

/**
 * The visitor bike as a scroll companion: docked to the right edge, riding
 * down the page in step with scroll progress, wheels spinning with velocity.
 * On the home page it stays hidden until the visitor scrolls past the hero
 * (where the full-size bike sits on its platform).
 */
export function ScrollBike() {
  const pathname = usePathname();
  const { bike, openCustomizer } = useBike();
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0.15);
  const [rotation, setRotation] = useState(0);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? y / max : 0;

      const isHome = pathname === "/";
      setVisible(isHome ? y > window.innerHeight * 0.75 : true);
      setTop(0.12 + progress * 0.72);
      setRotation((r) => r + (y - lastY.current) * 0.55);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <button
      type="button"
      onClick={openCustomizer}
      aria-label="Your visitor bike — click to customize"
      title="Your visitor bike — click to customize"
      className={`scroll-bike group fixed right-2 z-40 hidden w-20 cursor-pointer transition-[opacity,transform] duration-500 md:block ${
        visible ? "translate-x-0 opacity-100" : "translate-x-24 opacity-0"
      }`}
      style={{ top: `${top * 100}vh`, transitionProperty: "opacity, transform, top" }}
    >
      <BikeSvg config={bike} wheelRotation={rotation} className="w-full drop-shadow-sm" />
      <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 font-mono text-[10px] text-paper opacity-0 transition-opacity group-hover:opacity-100">
        your bike
      </span>
    </button>
  );
}
