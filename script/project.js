import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.querySelector(".project-snapshots-wrapper");
  const snapshotsSection = document.querySelector(".project-snapshots");

  if (!wrapper || !snapshotsSection) return;

  const snapshots = wrapper.querySelectorAll(".project-snapshot");
  const snapshotCount = snapshots.length;

  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "snapshots-progress-bar";

  for (let i = 0; i < 30; i++) {
    const indicator = document.createElement("div");
    indicator.className = "progress-indicator";
    progressBarContainer.appendChild(indicator);
  }

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressBarContainer.appendChild(progressBar);

  snapshotsSection.appendChild(progressBarContainer);

  const wrapperWidth = wrapper.offsetWidth;
  const viewportWidth = window.innerWidth;

  const moveDistance = -(wrapperWidth - viewportWidth);

  console.log("Wrapper width:", wrapperWidth);
  console.log("Viewport width:", viewportWidth);
  console.log("Move distance:", moveDistance);

  const progressBarElement = progressBar;

  ScrollTrigger.create({
    trigger: ".project-snapshots",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      const currentTranslateX = progress * moveDistance;

      gsap.set(wrapper, {
        x: currentTranslateX,
      });

      if (progressBarElement) {
        gsap.set(progressBarElement, {
          width: `${progress * 100}%`,
        });
      }
    },
  });

  const handleResize = () => {
    ScrollTrigger.refresh();
  };

  window.addEventListener("resize", handleResize);
});
