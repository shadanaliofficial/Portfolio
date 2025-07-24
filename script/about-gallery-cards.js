import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const galleryCards = gsap.utils.toArray(".gallery-card");
  const rotations = [-12, 10, -5, 5, -5, -2];

  galleryCards.forEach((galleryCard, index) => {
    gsap.set(galleryCard, {
      y: window.innerHeight,
      rotate: rotations[index],
    });
  });

  ScrollTrigger.create({
    trigger: ".about-skills",
    start: "top top",
    end: `+=${window.innerHeight * 3}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
  });

  ScrollTrigger.create({
    trigger: ".about-sticky-cards",
    start: "top top",
    end: `+=${window.innerHeight * 8}px`,
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
            const distanceMultiplier = 1 - index * 0.15;
            xPos =
              -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
            yPos =
              -window.innerHeight *
              0.3 *
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
});
