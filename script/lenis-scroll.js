import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  
  // Configure ScrollTrigger for better pin handling
  ScrollTrigger.config({
    anticipatePin: 1,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });

  let isMobile = window.innerWidth <= 900;
  
  const scrollSettings = isMobile
    ? {
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 1.5,
        lerp: 0.1, // Increased for snappier mobile feel
        wheelMultiplier: 1,
        smoothWheel: true,
        touchInertiaMultiplier: 25, // Reduced for less "floaty" feel
        syncTouch: false, // Disable for better mobile performance
      }
    : {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        lerp: 0.08,
        wheelMultiplier: 1,
        smoothWheel: true,
      };

  let lenis = new Lenis(scrollSettings);

  // Lenis + ScrollTrigger integration
  lenis.on("scroll", ScrollTrigger.update);

  // Use ONLY GSAP ticker (single animation loop)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger after initialization
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  // Refresh on window load
  window.addEventListener("load", () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });

  const handleResize = () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 900;

    if (wasMobile !== isMobile) {
      lenis.destroy();
      
      const newScrollSettings = isMobile
        ? {
            duration: 1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 1.5,
            lerp: 0.1,
            wheelMultiplier: 1,
            smoothWheel: true,
            touchInertiaMultiplier: 25,
            syncTouch: false,
          }
        : {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
            lerp: 0.08,
            wheelMultiplier: 1,
            smoothWheel: true,
          };

      lenis = new Lenis(newScrollSettings);
      lenis.on("scroll", ScrollTrigger.update);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    } else {
      ScrollTrigger.refresh();
    }
  };

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });

  // Expose lenis globally
  window.lenis = lenis;
});