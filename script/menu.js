import gsap from "gsap";

const menu = document.querySelector(".menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuOverlay = document.querySelector(".menu-overlay");
const menuItems = document.querySelectorAll(".menu-nav li");
const menuFooter = document.querySelector(".menu-footer");

let isOpen = false;

function initMenu() {
  gsap.set(menuOverlay, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  gsap.set(menuItems, {
    opacity: 0,
    y: 20,
  });

  gsap.set(menuFooter, {
    opacity: 0,
    y: 20,
  });
}

function toggleMenu() {
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  isOpen = true;
  menuToggle.classList.add("active");

  const tl = gsap.timeline();

  tl.to(menuOverlay, {
    duration: 0.5,
    scaleY: 1,

    ease: "power3.out",
  });

  tl.to(
    menuItems,
    {
      duration: 0.3,
      opacity: 1,
      y: 0,
      stagger: 0.05,
      ease: "power3.out",
    },
    "-=0.2"
  );

  tl.to(
    menuFooter,
    {
      duration: 0.3,
      opacity: 1,
      y: 0,
      ease: "power2.out",
    },
    "-=0.1"
  );
}

function closeMenu() {
  isOpen = false;
  menuToggle.classList.remove("active");

  const tl = gsap.timeline();

  tl.to([menuItems, menuFooter], {
    duration: 0.4,
    opacity: 0,
    y: 20,
    stagger: 0.02,
    ease: "power2.in",
  });

  tl.to(
    menuOverlay,
    {
      duration: 0.5,
      scaleY: 0,

      ease: "power3.inOut",
    },
    "-=0.1"
  );
}

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const timeElement = document.querySelector(".menu-time");
  if (timeElement) {
    timeElement.textContent = `${timeString} NY`;
  }
}

function init() {
  initMenu();

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      link.addEventListener("click", () => {
        if (isOpen) {
          closeMenu();
        }
      });
    }
  });

  updateTime();
  setInterval(updateTime, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
