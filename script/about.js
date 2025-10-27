import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  initAnimations();

  // Detect mobile/tablet
  const isMobile = window.innerWidth <= 767;
  const isTablet = window.innerWidth > 767 && window.innerWidth <= 1024;
  const isSmallMobile = window.innerWidth <= 480;

  const animeTextParagraphs = document.querySelectorAll(".anime-text p");
  const wordHighlightBgColor = "191, 188, 180";

  const keywords = [
    "online",
    "legacy",
    "journal",
    "shadan",
    "studio",
    "purpose",
    "launch",
    "focus",
    "intent",
  ];

  animeTextParagraphs.forEach((paragraph) => {
    const text = paragraph.textContent;
    const words = text.split(/\s+/);
    paragraph.innerHTML = "";

    words.forEach((word) => {
      if (word.trim()) {
        const wordContainer = document.createElement("div");
        wordContainer.className = "word";

        const wordText = document.createElement("span");
        wordText.textContent = word;

        const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
        if (keywords.includes(normalizedWord)) {
          wordContainer.classList.add("keyword-wrapper");
          wordText.classList.add("keyword", normalizedWord);
        }

        wordContainer.appendChild(wordText);
        paragraph.appendChild(wordContainer);
      }
    });
  });

  const animeTextContainers = document.querySelectorAll(
    ".anime-text-container"
  );

  // Adjust scroll distances based on screen size
  const scrollMultiplier = isSmallMobile ? 3 : isMobile ? 3.5 : isTablet ? 4 : 4;

  animeTextContainers.forEach((container) => {
    ScrollTrigger.create({
      trigger: container,
      pin: container,
      start: "top top",
      end: `+=${window.innerHeight * scrollMultiplier}`,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const words = Array.from(
          container.querySelectorAll(".anime-text .word")
        );
        const totalWords = words.length;

        words.forEach((word, index) => {
          const wordText = word.querySelector("span");

          if (progress <= 0.7) {
            const progressTarget = 0.7;
            const revealProgress = Math.min(1, progress / progressTarget);

            // Adjust overlap for mobile
            const overlapWords = isMobile ? 10 : 15;
            const totalAnimationLength = 1 + overlapWords / totalWords;

            const wordStart = index / totalWords;
            const wordEnd = wordStart + overlapWords / totalWords;

            const timelineScale =
              1 /
              Math.min(
                totalAnimationLength,
                1 + (totalWords - 1) / totalWords + overlapWords / totalWords
              );

            const adjustedStart = wordStart * timelineScale;
            const adjustedEnd = wordEnd * timelineScale;
            const duration = adjustedEnd - adjustedStart;

            const wordProgress =
              revealProgress <= adjustedStart
                ? 0
                : revealProgress >= adjustedEnd
                ? 1
                : (revealProgress - adjustedStart) / duration;

            word.style.opacity = wordProgress;

            const backgroundFadeStart =
              wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
            const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

            const textRevealThreshold = 0.9;
            const textRevealProgress =
              wordProgress >= textRevealThreshold
                ? (wordProgress - textRevealThreshold) /
                  (1 - textRevealThreshold)
                : 0;
            wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
          } else {
            const reverseProgress = (progress - 0.7) / 0.3;
            word.style.opacity = 1;
            const targetTextOpacity = 1;

            const reverseOverlapWords = isMobile ? 3 : 5;
            const reverseWordStart = index / totalWords;
            const reverseWordEnd =
              reverseWordStart + reverseOverlapWords / totalWords;

            const reverseTimelineScale =
              1 /
              Math.max(
                1,
                (totalWords - 1) / totalWords + reverseOverlapWords / totalWords
              );

            const reverseAdjustedStart =
              reverseWordStart * reverseTimelineScale;
            const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
            const reverseDuration = reverseAdjustedEnd - reverseAdjustedStart;

            const reverseWordProgress =
              reverseProgress <= reverseAdjustedStart
                ? 0
                : reverseProgress >= reverseAdjustedEnd
                ? 1
                : (reverseProgress - reverseAdjustedStart) / reverseDuration;

            if (reverseWordProgress > 0) {
              wordText.style.opacity =
                targetTextOpacity * (1 - reverseWordProgress);
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${reverseWordProgress})`;
            } else {
              wordText.style.opacity = targetTextOpacity;
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
            }
          }
        });
      },
    });
  });

  const animateOnScroll = true;

  const config = {
    gravity: { x: 0, y: 1 },
    restitution: isMobile ? 0.4 : 0.5,
    friction: isMobile ? 0.2 : 0.15,
    frictionAir: isMobile ? 0.03 : 0.02,
    density: isMobile ? 0.0015 : 0.002,
    wallThickness: isMobile ? 150 : 200,
  };

  let engine,
    runner,
    bodies = [],
    topWall = null;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function initPhysics(container) {
    engine = Matter.Engine.create();
    engine.gravity = config.gravity;

    engine.constraintIterations = 15;
    engine.positionIterations = 25;
    engine.velocityIterations = 20;

    engine.enableSleeping = true;
    engine.timing.timeScale = 1;

    const containerRect = container.getBoundingClientRect();
    const wallThickness = config.wallThickness;
    const floorOffset = isMobile ? 4 : 8;

    const walls = [
      Matter.Bodies.rectangle(
        containerRect.width / 2,
        containerRect.height - floorOffset + wallThickness / 2,
        containerRect.width + wallThickness * 2,
        wallThickness,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        -wallThickness / 2,
        containerRect.height / 2,
        wallThickness,
        containerRect.height + wallThickness * 2,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        containerRect.width + wallThickness / 2,
        containerRect.height / 2,
        wallThickness,
        containerRect.height + wallThickness * 2,
        { isStatic: true }
      ),
    ];
    Matter.World.add(engine.world, walls);

    const objects = container.querySelectorAll(".object");
    objects.forEach((obj, index) => {
      const objRect = obj.getBoundingClientRect();

      const startX =
        Math.random() * (containerRect.width - objRect.width) +
        objRect.width / 2;
      const startY = isMobile ? -300 - index * 150 : -500 - index * 200;
      const startRotation = (Math.random() - 0.5) * Math.PI;

      const body = Matter.Bodies.rectangle(
        startX,
        startY,
        objRect.width,
        objRect.height,
        {
          restitution: config.restitution,
          friction: config.friction,
          frictionAir: config.frictionAir,
          density: config.density,
          chamfer: { radius: isMobile ? 6 : 10 },
          slop: 0.02,
        }
      );

      Matter.Body.setAngle(body, startRotation);

      bodies.push({
        body: body,
        element: obj,
        width: objRect.width,
        height: objRect.height,
      });

      Matter.World.add(engine.world, body);
    });

    Matter.Events.on(engine, "beforeUpdate", function () {
      bodies.forEach(({ body }) => {
        const maxVelocity = isMobile ? 200 : 250;

        if (Math.abs(body.velocity.x) > maxVelocity) {
          Matter.Body.setVelocity(body, {
            x: body.velocity.x > 0 ? maxVelocity : -maxVelocity,
            y: body.velocity.y,
          });
        }
        if (Math.abs(body.velocity.y) > maxVelocity) {
          Matter.Body.setVelocity(body, {
            x: body.velocity.x,
            y: body.velocity.y > 0 ? maxVelocity : -maxVelocity,
          });
        }
      });
    });

    setTimeout(() => {
      topWall = Matter.Bodies.rectangle(
        containerRect.width / 2,
        -wallThickness / 2,
        containerRect.width + wallThickness * 2,
        wallThickness,
        { isStatic: true }
      );
      Matter.World.add(engine.world, topWall);
    }, isMobile ? 2000 : 3000);

    setInterval(() => {
      if (bodies.length > 0 && Math.random() < 0.3) {
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
        const forceMultiplier = isMobile ? 0.015 : 0.02;
        const randomForce = {
          x: (Math.random() - 0.5) * forceMultiplier,
          y: (Math.random() - 0.5) * (forceMultiplier * 0.5),
        };
        Matter.Body.applyForce(
          randomBody.body,
          randomBody.body.position,
          randomForce
        );
      }
    }, isMobile ? 2500 : 2000);

    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    function updatePositions() {
      bodies.forEach(({ body, element, width, height }) => {
        const x = clamp(
          body.position.x - width / 2,
          0,
          containerRect.width - width
        );
        const y = clamp(
          body.position.y - height / 2,
          -height * 3,
          containerRect.height - height - floorOffset
        );

        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.transform = `rotate(${body.angle}rad)`;
      });

      requestAnimationFrame(updatePositions);
    }
    updatePositions();
  }

  // Initialize physics for about-skills section
  if (animateOnScroll) {
    const aboutSkillsSection = document.querySelector(".about-skills");
    if (aboutSkillsSection) {
      const container = aboutSkillsSection.querySelector(".object-container");
      if (container) {
        ScrollTrigger.create({
          trigger: aboutSkillsSection,
          start: "top bottom",
          once: true,
          onEnter: () => {
            if (!engine) {
              initPhysics(container);
            }
          },
        });
      }
    }
  } else {
    window.addEventListener("load", () => {
      const container = document.querySelector(".about-skills .object-container");
      if (container) {
        initPhysics(container);
      }
    });
  }

  const galleryCards = gsap.utils.toArray(".gallery-card");
  const rotations = isMobile 
    ? [-8, 6, -4, 4, -3, -2]  // Smaller rotations for mobile
    : [-12, 10, -5, 5, -5, -2];

  galleryCards.forEach((galleryCard, index) => {
    gsap.set(galleryCard, {
      y: window.innerHeight,
      rotate: rotations[index],
    });
  });

  // Adjust skills section pin duration for mobile
  const skillsPinDuration = isMobile ? 2.5 : 3;
  
  ScrollTrigger.create({
    trigger: ".about-skills",
    start: "top top",
    end: `+=${window.innerHeight * skillsPinDuration}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
  });

  // Adjust sticky cards duration for mobile
  const stickyCardsDuration = isSmallMobile ? 6 : isMobile ? 7 : 8;

  ScrollTrigger.create({
    trigger: ".about-sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * stickyCardsDuration}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalCards = galleryCards.length;
      const progressPerCard = 1 / totalCards;

      galleryCards.forEach((galleryCard, index) => {
        const galleryCardStart = index * progressPerCard;
        let galleryCardProgress =
          (progress - galleryCardStart) / progressPerCard;
        galleryCardProgress = Math.min(Math.max(galleryCardProgress, 0), 1);

        let yPos = window.innerHeight * (1 - galleryCardProgress);
        let xPos = 0;

        if (galleryCardProgress === 1 && index < totalCards - 1) {
          const remainingProgress =
            (progress - (galleryCardStart + progressPerCard)) /
            (1 - (galleryCardStart + progressPerCard));
          if (remainingProgress > 0) {
            // Adjust movement for mobile
            const distanceMultiplier = 1 - index * (isMobile ? 0.1 : 0.15);
            const xMultiplier = isMobile ? 0.4 : 0.3;
            const yMultiplier = isMobile ? 0.25 : 0.3;
            
            xPos =
              -window.innerWidth * xMultiplier * distanceMultiplier * remainingProgress;
            yPos =
              -window.innerHeight *
              yMultiplier *
              distanceMultiplier *
              remainingProgress;
          }
        }

        gsap.to(galleryCard, {
          y: yPos,
          x: xPos,
          duration: 0,
          ease: "none",
        });
      });
    },
  });

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
  const stripSpeeds = isMobile 
    ? [0.25, 0.35, 0.2, 0.3, 0.15, 0.2]  // Slower speeds for mobile
    : [0.3, 0.4, 0.25, 0.35, 0.2, 0.25];

  const outroPinDuration = isMobile ? 2.5 : 3;

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top top",
    end: `+=${window.innerHeight * outroPinDuration}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
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

  const outroStripsDuration = isMobile ? 5 : 6;

  ScrollTrigger.create({
    trigger: ".outro",
    start: "top bottom",
    end: `+=${window.innerHeight * outroStripsDuration}px`,
    scrub: 1,
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

  // Refresh ScrollTrigger on resize for responsive adjustments
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
});