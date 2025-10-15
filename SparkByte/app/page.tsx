"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const smoothStep = (p: number) => p * p * (3 - 2 * p);

    const heroTrigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "75% top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const heroCardContainerOpacity = gsap.utils.interpolate(1, 0.5, smoothStep(progress));
        gsap.set(".hero-cards", { opacity: heroCardContainerOpacity });

        ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach((cardId, index) => {
          const delay = index * 0.9;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1));

          const y = gsap.utils.interpolate("0%", "250%", smoothStep(cardProgress));
          const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));

          let x: string = "0%";
          let rotation = 0;
          if (index === 0) {
            x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
            rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
          } else if (index === 2) {
            x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress));
            rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
          }

          gsap.set(cardId, { y, scale, x, rotation });
        });
      },
    });

    const servicesPin = ScrollTrigger.create({
      trigger: ".services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: ".services",
      pinSpacing: true,
    });

    const cardsPositioning = ScrollTrigger.create({
      trigger: ".services",
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      onLeave: () => {
        const servicesSection = document.querySelector(".services");
        if (!servicesSection) return;
        const servicesRect = servicesSection.getBoundingClientRect();
        const servicesTop = servicesRect.top + window.pageYOffset;

        gsap.set(".cards", {
          position: "absolute",
          top: servicesTop,
          left: 0,
          width: "100vw",
          height: "100vh",
        });
      },
      onEnterBack: () => {
        gsap.set(".cards", {
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        });
      },
    });

    const servicesUpdate = ScrollTrigger.create({
      trigger: ".services",
      start: "top bottom",
      end: `+=${window.innerHeight * 4}px`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const headerProgress = gsap.utils.clamp(0, 1, progress * 0.9);
        const headerY = gsap.utils.interpolate("400%", "0%", smoothStep(headerProgress));
        gsap.set(".services-header", { y: headerY });

        ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
          const delay = index * 0.5;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));
          const innerCard = document.querySelector(`${cardId} .flip-card-inner`) as HTMLElement | null;

          let y: string;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            y = gsap.utils.interpolate("-100%", "50%", smoothStep(normalizedProgress));
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            y = gsap.utils.interpolate("50%", "0%", smoothStep(normalizedProgress));
          } else {
            y = "0%";
          }

          let scale: number;
          if (cardProgress < 0.4) {
            const normalizedProgress = cardProgress / 0.4;
            scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(normalizedProgress));
          } else if (cardProgress < 0.6) {
            const normalizedProgress = (cardProgress - 0.4) / 0.2;
            scale = gsap.utils.interpolate(0.75, 1, smoothStep(normalizedProgress));
          } else {
            scale = 1;
          }

          let opacity: number;
          if (cardProgress < 0.2) {
            const normalizedProgress = cardProgress / 0.2;
            opacity = smoothStep(normalizedProgress);
          } else {
            opacity = 1;
          }

          let x: string, rotate: number, rotateY: number;
          if (cardProgress < 0.6) {
            x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
            rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
            rotateY = 0;
          } else if (cardProgress < 1) {
            const normalizedProgress = (cardProgress - 0.6) / 0.4;
            x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", smoothStep(normalizedProgress));
            rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, smoothStep(normalizedProgress));
            rotateY = smoothStep(normalizedProgress) * 180;
          } else {
            x = "0%";
            rotate = 0;
            rotateY = 180;
          }

          gsap.set(cardId, { y, x, scale, rotate, opacity });
          if (innerCard) gsap.set(innerCard, { rotationY: rotateY });
        });
      },
    });

    return () => {
      heroTrigger.kill();
      servicesPin.kill();
      cardsPositioning.kill();
      servicesUpdate.kill();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <main>
      <nav>
        <div className="logo"><span>Site Logo</span></div>
        <div className="menu-btn"><span>Menu</span></div>
      </nav>

      <section className="hero">
        <div className="hero-cards">
          <div className="card" id="hero-card-1">
            <div className="card-title">
              <span>Plan</span>
              <span>01</span>
            </div>
            <div className="card-title">
              <span>01</span>
              <span>Plan</span>
            </div>
          </div>
          <div className="card" id="hero-card-2">
            <div className="card-title">
              <span>Design</span>
              <span>02</span>
            </div>
            <div className="card-title">
              <span>02</span>
              <span>Design</span>
            </div>
          </div>
          <div className="card" id="hero-card-3">
            <div className="card-title">
              <span>Develop</span>
              <span>03</span>
            </div>
            <div className="card-title">
              <span>03</span>
              <span>Develop</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about">
        <h1>Keep scrolling - it gets good</h1>
      </section>

      <section className="services">
        <div className="services-header">
          <h1>Stuff I make so you don't have to</h1>
        </div>
      </section>

      <section className="cards">
        <div className="cards-container">
          <div className="card" id="card-1">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Plan</span>
                    <span>01</span>
                  </div>
                  <div className="card-title">
                    <span>01</span>
                    <span>Plan</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Plan</span>
                    <span>01</span>
                  </div>
                  <div className="card-copy">
                    <p>Discovery</p>
                    <p>Audit</p>
                    <p>User Flow</p>
                    <p>Site Map</p>
                    <p>Personas</p>
                    <p>Strategy</p>
                  </div>
                  <div className="card-title">
                    <span>01</span>
                    <span>Plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card" id="card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Design</span>
                    <span>02</span>
                  </div>
                  <div className="card-title">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Design</span>
                    <span>02</span>
                  </div>
                  <div className="card-copy">
                    <p>Wireframes</p>
                    <p>UI Kits</p>
                    <p>Prototypes</p>
                    <p>Visual Style</p>
                    <p>Interaction</p>
                    <p>Design QA</p>
                  </div>
                  <div className="card-title">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card" id="card-3">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Develop</span>
                    <span>03</span>
                  </div>
                  <div className="card-title">
                    <span>03</span>
                    <span>Develop</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Plan</span>
                    <span>03</span>
                  </div>
                  <div className="card-copy">
                    <p>HTML/CSS/JS</p>
                    <p>CMS Bulid</p>
                    <p>GSAP Motion</p>
                    <p>Responsive</p>
                    <p>Optimization</p>
                    <p>Launch</p>
                  </div>
                  <div className="card-title">
                    <span>03</span>
                    <span>Develop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <h1>The story's not over yet</h1>
      </section>
    </main>
  );
}
