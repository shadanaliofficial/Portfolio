import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const animateOnScroll = true;

  const config = {
    gravity: { x: 0, y: 1 },
    restitution: 0.5,
    friction: 0.15,
    frictionAir: 0.02,
    density: 0.002,
    wallThickness: 200,
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
    const floorOffset = 8;

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
      const startY = -500 - index * 200;
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
          chamfer: { radius: 10 },
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
        const maxVelocity = 250;

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
    }, 3000);

    setInterval(() => {
      if (bodies.length > 0 && Math.random() < 0.3) {
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
        const randomForce = {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.01,
        };
        Matter.Body.applyForce(
          randomBody.body,
          randomBody.body.position,
          randomForce
        );
      }
    }, 2000);

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

  if (animateOnScroll) {
    document.querySelectorAll("section").forEach((section) => {
      if (section.querySelector(".object-container")) {
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          once: true,
          onEnter: () => {
            const container = section.querySelector(".object-container");
            if (container && !engine) {
              initPhysics(container);
            }
          },
        });
      }
    });
  } else {
    window.addEventListener("load", () => {
      const container = document.querySelector(".object-container");
      if (container) {
        initPhysics(container);
      }
    });
  }
});
