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
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.08, // Slightly reduced for more responsive feel
        wheelMultiplier: 1.2,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
        touchInertiaMultiplier: 35,
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
        lerp: 0.08, // Slightly reduced for snappier response
        wheelMultiplier: 1,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: true,
      };

  let lenis = new Lenis(scrollSettings);

  // Proper Lenis + ScrollTrigger integration
  lenis.on("scroll", (e) => {
    ScrollTrigger.update();
  });

  // Use requestAnimationFrame for better performance
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // GSAP ticker integration (backup method)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Refresh ScrollTrigger after Lenis is initialized
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  // Refresh on window load to ensure everything is calculated correctly
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
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 2,
            infinite: false,
            lerp: 0.08,
            wheelMultiplier: 1.2,
            orientation: "vertical",
            smoothWheel: true,
            syncTouch: true,
            touchInertiaMultiplier: 35,
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
            lerp: 0.08,
            wheelMultiplier: 1,
            orientation: "vertical",
            smoothWheel: true,
            syncTouch: true,
          };

      lenis = new Lenis(newScrollSettings);
      
      lenis.on("scroll", (e) => {
        ScrollTrigger.update();
      });

      // Refresh ScrollTrigger after reinitializing Lenis
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    } else {
      // Just refresh if only size changed, not mobile state
      ScrollTrigger.refresh();
    }
  };

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });

  // Expose lenis globally if needed for other scripts
  window.lenis = lenis;
});