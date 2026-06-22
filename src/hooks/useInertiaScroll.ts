import { useEffect } from "react";

export function useInertiaScroll(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const initialScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let isMoving = false;
    let rafId: number | null = null;

    const smoothScroll = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) > 0.4) {
        currentY += diff * 0.08;
        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(smoothScroll);
      } else {
        currentY = targetY;
        window.scrollTo(0, currentY);
        isMoving = false;
        rafId = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const path = e.composedPath();
      for (const element of path) {
        if (element instanceof HTMLElement) {
          const style = window.getComputedStyle(element);
          if (
            element.scrollHeight > element.clientHeight &&
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            element !== document.documentElement &&
            element !== document.body
          ) {
            return;
          }
        }
      }

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      
      if (maxScroll <= 0) {
        return;
      }

      e.preventDefault();

      targetY = Math.max(0, Math.min(targetY + e.deltaY * 0.95, maxScroll));

      if (!isMoving) {
        isMoving = true;
        currentY = window.scrollY;
        rafId = requestAnimationFrame(smoothScroll);
      }
    };

    const handleScroll = () => {
      if (!isMoving) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.documentElement.style.scrollBehavior = initialScrollBehavior;
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive]);
}
