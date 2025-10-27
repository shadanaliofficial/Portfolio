import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  let isMobile = window.innerWidth <= 900;

  const scrollSettings = isMobile
    ? {
        duration: 1.2,                    // Increased from 0.8 to match desktop
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: true,                // Keep touch smoothing enabled
        touchMultiplier: 2,               // Increased from 1.5 for better response
        infinite: false,
        lerp: 0.1,                        // Increased from 0.09 to match desktop
        wheelMultiplier: 1.2,             // Slightly increased for better feel
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
        touchInertiaMultiplier: 35,       // Added for better touch momentum
      }
    : {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      };

  let lenis = new Lenis(scrollSettings);

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const handleResize = () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 900;

    if (wasMobile !== isMobile) {
      lenis.destroy();

      const newScrollSettings = isMobile
        ? {
            duration: 1.2,                    // Increased to match desktop
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 2,               // Increased from 1.5
            infinite: false,
            lerp: 0.1,                        // Increased from 0.05
            wheelMultiplier: 1.2,             // Increased for consistency
            orientation: "vertical",
            smoothWheel: true,
            syncTouch: true,
            touchInertiaMultiplier: 35,       // Added for momentum
          }
        : {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            lerp: 0.1,
            wheelMultiplier: 1,
            orientation: "vertical",
            smoothWheel: true,
            syncTouch: true,
          };

      lenis = new Lenis(newScrollSettings);
      lenis.on("scroll", ScrollTrigger.update);
    }
  };

  window.addEventListener("resize", handleResize);
});