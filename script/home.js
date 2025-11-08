import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Force scroll to top on page load to ensure proper initialization
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Function to reset hero cards to initial state
  function resetHeroCards() {
    gsap.set(".hero .hero-cards .card", { 
      scale: 0,
      y: "0%",
      x: "0%",
      rotation: 0
    });
    gsap.set(".hero-cards", { opacity: 1 });
  }

  // Function to animate hero cards on load/return
  function animateHeroCards() {
    gsap.to(".hero .hero-cards .card", {
      scale: 1,
      duration: 0.75,
      delay: 0.25,
      stagger: 0.1,
      ease: "power4.out",
      onComplete: () => {
        gsap.set("#hero-card-1", { transformOrigin: "top right" });
        gsap.set("#hero-card-3", { transformOrigin: "top left" });
      },
    });
  }

  // Initial card animation
  resetHeroCards();
  animateHeroCards();

  const smoothStep = (p) => p * p * (3 - 2 * p);

  // Check if device is mobile/tablet
  const isMobile = window.innerWidth <= 767;
  const isTablet = window.innerWidth > 767 && window.innerWidth <= 1024;
  const isDesktop = window.innerWidth > 1024;

  // HERO CARDS SCROLL ANIMATION - Now works on all devices
  if (isDesktop) {
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "75% top",
      scrub: true, // Changed from scrub: 1 to scrub: true for instant response
      onUpdate: (self) => {
        const progress = self.progress;

        const heroCardsContainerOpacity = gsap.utils.interpolate(
          1,
          0.5,
          smoothStep(progress)
        );
        gsap.set(".hero-cards", {
          opacity: heroCardsContainerOpacity,
        });

        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach(
          (cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (1 - delay * 0.1)
            );

            const y = gsap.utils.interpolate(
              "0%",
              "400%",
              smoothStep(cardProgress)
            );
            const scale = gsap.utils.interpolate(
              1,
              0.75,
              smoothStep(cardProgress)
            );

            let x = "0%";
            let rotation = 0;
            if (index === 0) {
              x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(
                0,
                -15,
                smoothStep(cardProgress)
              );
            } else if (index === 2) {
              x = gsap.utils.interpolate(
                "0%",
                "-90%",
                smoothStep(cardProgress)
              );
              rotation = gsap.utils.interpolate(
                0,
                15,
                smoothStep(cardProgress)
              );
            }

            gsap.set(cardId, {
              y: y,
              x: x,
              rotation: rotation,
              scale: scale,
            });
          }
        );
      },
    });
  } else {
    // Mobile and Tablet hero animation - simplified but still animated
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "75% top",
      scrub: true, // Changed from scrub: 1
      onUpdate: (self) => {
        const progress = self.progress;

        const heroCardsContainerOpacity = gsap.utils.interpolate(
          1,
          0.3,
          smoothStep(progress)
        );
        gsap.set(".hero-cards", {
          opacity: heroCardsContainerOpacity,
        });

        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach(
          (cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(
              0,
              1,
              (progress - delay * 0.1) / (1 - delay * 0.1)
            );

            const y = gsap.utils.interpolate(
              "0%",
              "300%",
              smoothStep(cardProgress)
            );
            const scale = gsap.utils.interpolate(
              1,
              0.8,
              smoothStep(cardProgress)
            );

            let x = "0%";
            let rotation = 0;
            if (index === 0) {
              x = gsap.utils.interpolate("0%", "60%", smoothStep(cardProgress));
              rotation = gsap.utils.interpolate(
                0,
                -10,
                smoothStep(cardProgress)
              );
            } else if (index === 2) {
              x = gsap.utils.interpolate(
                "0%",
                "-60%",
                smoothStep(cardProgress)
              );
              rotation = gsap.utils.interpolate(
                0,
                10,
                smoothStep(cardProgress)
              );
            }

            gsap.set(cardId, {
              y: y,
              x: x,
              rotation: rotation,
              scale: scale,
            });
          }
        );
      },
    });
  }

  // HOME SERVICES ANIMATION - Reduced pin height and changed scrub
  const servicesPinHeight = isMobile ? window.innerHeight * 2.5 : isTablet ? window.innerHeight * 3 : window.innerHeight * 3.5;

  ScrollTrigger.create({
    trigger: ".home-services",
    start: "top top",
    end: `+=${servicesPinHeight}`,
    pin: ".home-services",
    pinSpacing: true,
    anticipatePin: 1, // Added for smoother pinning
  });

  ScrollTrigger.create({
    trigger: ".home-services",
    start: "top bottom",
    end: `+=${servicesPinHeight}`,
    scrub: true, // Changed from scrub: 1
    onUpdate: (self) => {
      const progress = self.progress;

      const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
      const headerY = gsap.utils.interpolate(
        "300%",
        "0%",
        smoothStep(headerProgress)
      );
      gsap.set(".home-services-header", {
        y: headerY,
      });

      ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
        const delay = index * 0.5;
        const cardProgress = gsap.utils.clamp(
          0,
          1,
          (progress - delay * 0.1) / (0.9 - delay * 0.1)
        );

        const innerCard = document.querySelector(
          `${cardId} .flip-card-inner`
        );

        let y;
        if (cardProgress < 0.4) {
          const normalizedProgress = cardProgress / 0.4;
          y = gsap.utils.interpolate(
            "-100%",
            "50%",
            smoothStep(normalizedProgress)
          );
        } else if (cardProgress < 0.6) {
          const normalizedProgress = (cardProgress - 0.4) / 0.2;
          y = gsap.utils.interpolate(
            "50%",
            "0%",
            smoothStep(normalizedProgress)
          );
        } else {
          y = "0%";
        }

        let scale;
        if (cardProgress < 0.4) {
          const normalizedProgress = cardProgress / 0.4;
          scale = gsap.utils.interpolate(
            0.25,
            0.75,
            smoothStep(normalizedProgress)
          );
        } else if (cardProgress < 0.6) {
          const normalizedProgress = (cardProgress - 0.4) / 0.2;
          scale = gsap.utils.interpolate(
            0.75,
            1,
            smoothStep(normalizedProgress)
          );
        } else {
          scale = 1;
        }

        let opacity;
        if (cardProgress < 0.2) {
          const normalizedProgress = cardProgress / 0.2;
          opacity = smoothStep(normalizedProgress);
        } else {
          opacity = 1;
        }

        let x, rotate, rotationY;
        if (cardProgress < 0.6) {
          x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
          rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
          rotationY = 0;
        } else if (cardProgress < 1) {
          const normalizedProgress = (cardProgress - 0.6) / 0.4;
          x = gsap.utils.interpolate(
            index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
            "0%",
            smoothStep(normalizedProgress)
          );
          rotate = gsap.utils.interpolate(
            index === 0 ? -5 : index === 1 ? 0 : 5,
            0,
            smoothStep(normalizedProgress)
          );
          rotationY = smoothStep(normalizedProgress) * 180;
        } else {
          x = "0%";
          rotate = 0;
          rotationY = 180;
        }

        gsap.set(cardId, {
          opacity: opacity,
          y: y,
          x: x,
          rotate: rotate,
          scale: scale,
        });

        gsap.set(innerCard, {
          rotationY: rotationY,
        });
      });
    },
  });

  // SPOTLIGHT SECTION - Reduced heights and changed scrub
  const spotlightImages = document.querySelector(".home-spotlight-images");
  const containerHeight = spotlightImages.offsetHeight;
  const viewportHeight = window.innerHeight;

  const initialOffset = containerHeight * 0.05;
  const totalMovement = containerHeight + initialOffset + viewportHeight;

  const spotlightHeader = document.querySelector(".spotlight-mask-header h3");
  let headerSplit = null;

  if (spotlightHeader) {
    headerSplit = SplitText.create(spotlightHeader, {
      type: "words",
      wordsClass: "spotlight-word",
    });

    gsap.set(headerSplit.words, { opacity: 0 });
  }

  const spotlightPinHeight = isMobile ? window.innerHeight * 5 : isTablet ? window.innerHeight * 5.5 : window.innerHeight * 6;

  ScrollTrigger.create({
    trigger: ".home-spotlight",
    start: "top top",
    end: `+=${spotlightPinHeight}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1, // Added for smoother pinning
    scrub: true, // Changed from scrub: 1
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress <= 0.5) {
        const animationProgress = progress / 0.5;

        const startY = 5;
        const endY = -(totalMovement / containerHeight) * 100;

        const currentY = startY + (endY - startY) * animationProgress;

        gsap.set(spotlightImages, {
          y: `${currentY}%`,
        });
      }

      const maskContainer = document.querySelector(
        ".spotlight-mask-image-container"
      );
      const maskImage = document.querySelector(".spotlight-mask-image");

      if (maskContainer && maskImage) {
        if (progress >= 0.25 && progress <= 0.75) {
          const maskProgress = (progress - 0.25) / 0.5;
          const maskSize = `${maskProgress * 475}%`;

          const imageScale = 1.25 - maskProgress * 0.25;

          maskContainer.style.setProperty("-webkit-mask-size", maskSize);
          maskContainer.style.setProperty("mask-size", maskSize);

          gsap.set(maskImage, {
            scale: imageScale,
          });
        } else if (progress < 0.25) {
          maskContainer.style.setProperty("-webkit-mask-size", "0%");
          maskContainer.style.setProperty("mask-size", "0%");

          gsap.set(maskImage, {
            scale: 1.25,
          });
        } else if (progress > 0.75) {
          maskContainer.style.setProperty("-webkit-mask-size", "475%");
          maskContainer.style.setProperty("mask-size", "475%");

          gsap.set(maskImage, {
            scale: 1,
          });
        }
      }

      if (headerSplit && headerSplit.words.length > 0) {
        if (progress >= 0.75 && progress <= 0.95) {
          const textProgress = (progress - 0.75) / 0.2;
          const totalWords = headerSplit.words.length;

          headerSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.75) {
          gsap.set(headerSplit.words, { opacity: 0 });
        } else if (progress > 0.95) {
          gsap.set(headerSplit.words, { opacity: 1 });
        }
      }
    },
  });

  // OUTRO SECTION - Reduced heights and changed scrub
  const outroHeader = document.querySelector(".outro h3");
  let outroSplit = null;

  if (outroHeader) {
    outroSplit = SplitText.create(outroHeader, {
      type: "words",
      wordsClass: "outro-word",
    });

    gsap.set(outroSplit.words, { opacity: 0 });
  }

  const outroStrips = document.querySelectorAll(".outro-strip");
  const stripSpeeds = [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

  const outroPinHeight = isMobile ? window.innerHeight * 2 : isTablet ? window.innerHeight * 2.25 : window.innerHeight * 2.5;

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top top",
    end: `+=${outroPinHeight}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1, // Added for smoother pinning
    scrub: true, // Changed from scrub: 1
    onUpdate: (self) => {
      const progress = self.progress;

      if (outroSplit && outroSplit.words.length > 0) {
        if (progress >= 0.25 && progress <= 0.75) {
          const textProgress = (progress - 0.25) / 0.5;
          const totalWords = outroSplit.words.length;

          outroSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.25) {
          gsap.set(outroSplit.words, { opacity: 0 });
        } else if (progress > 0.75) {
          gsap.set(outroSplit.words, { opacity: 1 });
        }
      }
    },
  });

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top bottom",
    end: `+=${window.innerHeight * (isMobile ? 4 : isTablet ? 4.5 : 5)}`,
    scrub: true, // Changed from scrub: 1
    onUpdate: (self) => {
      const progress = self.progress;

      outroStrips.forEach((strip, index) => {
        if (stripSpeeds[index] !== undefined) {
          const speed = stripSpeeds[index];
          const movement = progress * 100 * speed;

          gsap.set(strip, {
            x: `${movement}%`,
          });
        }
      });
    },
  });

  // Smooth type loop
  function smoothTypeLoop(targetSelector, words, options = {}) {
    const el = document.querySelector(targetSelector);
    if (!el) return;

    const cfg = Object.assign(
      {
        typeDurPerChar: 0.06,
        deleteDurPerChar: 0.04,
        hold: 0.6,
        gap: 0.15,
        easeIn: "power2.out",
        easeOut: "power2.in",
      },
      options
    );

    let index = 0;

    function playWord() {
      const word = words[index];

      gsap.set(el, { textContent: "" });
      const typeState = { chars: 0 };

      gsap.to(typeState, {
        chars: word.length,
        duration: Math.max(0.2, word.length * cfg.typeDurPerChar),
        ease: cfg.easeIn,
        onUpdate: () => {
          el.textContent = word.slice(0, Math.round(typeState.chars));
        },
        onComplete: () => {
          gsap.delayedCall(cfg.hold, () => {
            const delState = { chars: word.length };
            gsap.to(delState, {
              chars: 0,
              duration: Math.max(0.15, word.length * cfg.deleteDurPerChar),
              ease: cfg.easeOut,
              onUpdate: () => {
                el.textContent = word.slice(0, Math.round(delState.chars));
              },
              onComplete: () => {
                index = (index + 1) % words.length;
                gsap.delayedCall(cfg.gap, playWord);
              },
            });
          });
        },
      });
    }

    playWord();
  }

  smoothTypeLoop("#type-loop", ["DESIGNING", "DEVELOPMENT"], {
    typeDurPerChar: 0.065,
    deleteDurPerChar: 0.065,
    hold: 1.2,
    gap: 0.25,
  });

});