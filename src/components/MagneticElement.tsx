import gsap from "gsap";
import React, { useEffect, useRef } from "react";

export default function MagneticElement({ children }: { children: React.ReactElement }) {
  const magnetic = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!magnetic.current) return;
    const magneticElement = magnetic.current;
    const xTo = gsap.quickTo(magneticElement, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)"
    });
    const yTo = gsap.quickTo(magneticElement, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)"
    });

    magneticElement.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = magneticElement.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x);
      yTo(y);
    });
    magneticElement.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  }, [magnetic]);

  return React.cloneElement(children, { ref: magnetic });
}
