import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

let splitInstances = [];

function getTextContent(element) {
  return element.textContent || element.innerText || "";
}

export function scrambleAnimation(element, delay = 0) {
  const textContent = getTextContent(element);

  if (!textContent.trim()) return;

  const split = new SplitText(element, {
    type: "chars",
  });

  splitInstances.push(split);

  gsap.set(split.chars, {
    opacity: 0,
  });

  setTimeout(() => {
    scrambleTextStaggered(split.chars, 0.4);
  }, delay * 1000);
}

export function revealAnimation(element, delay = 0) {
  const textContent = getTextContent(element);

  if (!textContent.trim()) return;

  const split = new SplitText(element, {
    type: "words",
    mask: "words",
  });

  splitInstances.push(split);

  gsap.set(split.words, {
    yPercent: 120,
  });

  gsap.to(split.words, {
    duration: 0.75,
    yPercent: 0,
    stagger: 0.1,
    ease: "power4.out",
    delay: delay,
  });
}

export function lineRevealAnimation(element, delay = 0) {
  const textContent = getTextContent(element);

  if (!textContent.trim()) return;

  const split = new SplitText(element, {
    type: "lines",
    mask: "lines",
  });

  splitInstances.push(split);

  gsap.set(split.lines, {
    yPercent: 120,
  });

  gsap.to(split.lines, {
    duration: 0.8,
    yPercent: 0,
    stagger: 0.1,
    ease: "power4.out",
    delay: delay,
  });
}

function scrambleTextStaggered(elements, duration = 0.4) {
  elements.forEach((char, index) => {
    setTimeout(() => {
      scrambleText([char], duration);
    }, index * 30);
  });
}

function scrambleText(elements, duration = 0.4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  elements.forEach((char, index) => {
    const originalText = char.textContent;
    let iterations = 0;
    const maxIterations = Math.floor(Math.random() * 6) + 3;

    gsap.set(char, { opacity: 1 });

    const scrambleInterval = setInterval(() => {
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval);
        char.textContent = originalText;
      }
    }, 50);

    setTimeout(() => {
      clearInterval(scrambleInterval);
      char.textContent = originalText;
    }, duration * 1000);
  });
}

export function initAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate-type]");

  animatedElements.forEach((element) => {
    const animationType = element.getAttribute("data-animate-type");
    const delay = parseFloat(element.getAttribute("data-animate-delay")) || 0;

    switch (animationType) {
      case "scramble":
        scrambleAnimation(element, delay);
        break;
      case "reveal":
        revealAnimation(element, delay);
        break;
      case "line-reveal":
        lineRevealAnimation(element, delay);
        break;
      default:
        console.warn(`Unknown animation type: ${animationType}`);
    }
  });
}

export function cleanupAnimations() {
  splitInstances.forEach((split) => {
    split.revert();
  });
  splitInstances = [];
}

export function animateElement(selector, type, delay = 0) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return;
  }

  switch (type) {
    case "scramble":
      scrambleAnimation(element, delay);
      break;
    case "reveal":
      revealAnimation(element, delay);
      break;
    case "line-reveal":
      lineRevealAnimation(element, delay);
      break;
    default:
      console.warn(`Unknown animation type: ${type}`);
  }
}

export function animateElements(selector, type, delay = 0, staggerDelay = 0.1) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) {
    console.warn(`Elements not found: ${selector}`);
    return;
  }

  elements.forEach((element, index) => {
    const totalDelay = delay + index * staggerDelay;

    switch (type) {
      case "scramble":
        scrambleAnimation(element, totalDelay);
        break;
      case "reveal":
        revealAnimation(element, totalDelay);
        break;
      case "line-reveal":
        lineRevealAnimation(element, totalDelay);
        break;
      default:
        console.warn(`Unknown animation type: ${type}`);
    }
  });
}
