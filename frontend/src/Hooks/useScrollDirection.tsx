
import { useState, useEffect, useRef, type RefObject } from "react";

export function useScrollDirection(
  containerRef: RefObject<HTMLElement>,
  threshold = 40
) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setVisible(true);
        return;
      }

      const currentScrollY = el.scrollTop;

      if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [containerRef, threshold]);

  return visible;
}