import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface HeroAnimationRefs {
  container: HTMLElement | null;
  headline: HTMLElement | null;
  subtext: HTMLElement | null;
  buttons: HTMLElement | null;
  mountain: HTMLElement | null;
  mountainImg?: HTMLElement | null;
  terrainShapes: HTMLElement | null;
  ambientGlow?: HTMLElement | null;
}

export const initHeroAnimation = (refs: HeroAnimationRefs) => {
  const {
    container,
    headline,
    subtext,
    buttons,
    mountain,
    mountainImg,
    terrainShapes,
    ambientGlow,
  } = refs;

  if (!container) return () => {};

  // Check reduced-motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      // Immediate reveal for accessibility
      gsap.set(
        [headline, subtext, buttons, mountain, terrainShapes, ambientGlow],
        { opacity: 1, y: 0, scale: 1 }
      );
      return;
    }

    const mm = gsap.matchMedia();

    // ==========================================
    // Desktop & Tablet (768px and up)
    // ==========================================
    mm.add('(min-width: 768px)', () => {
      // 1. Initial Load Entrance Timeline
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Ambient warm glow fade in
      if (ambientGlow) {
        entranceTl.fromTo(
          ambientGlow,
          { opacity: 0, scale: 0.85 },
          { opacity: 0.75, scale: 1, duration: 1.6, ease: 'sine.out' }
        );
      }

      // Mountain emergence with gentle lift and depth
      if (mountain) {
        entranceTl.fromTo(
          mountain,
          { opacity: 0, y: 65, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'power2.out' },
          '-=1.2'
        );
      }

      // Word-by-word reveal for headline
      if (headline) {
        const words = headline.querySelectorAll('.hero-word-inner');
        if (words.length > 0) {
          entranceTl.fromTo(
            words,
            { y: '115%', opacity: 0, rotateZ: 2 },
            {
              y: '0%',
              opacity: 1,
              rotateZ: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: 'power3.out',
            },
            '-=0.9'
          );
        } else {
          entranceTl.fromTo(
            headline,
            { opacity: 0, y: 35, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 1.0 },
            '-=0.9'
          );
        }
      }

      // Subtitle reveal
      if (subtext) {
        entranceTl.fromTo(
          subtext,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        );
      }

      // CTA Buttons reveal
      if (buttons) {
        const btnChildren = Array.from(buttons.children);
        entranceTl.fromTo(
          btnChildren,
          { opacity: 0, y: 20, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.14,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        );
      }

      // 2. Continuous Scroll-Scrubbed Mountain Immersion (Mont-Fort Inspired)
      // As user scrolls, the hero mountain artwork expands into the foreground,
      // moving the user deeper into the Sahyadri mountain landscape.
      const immersionTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      // Mountain scales into foreground & translates upwards
      if (mountain) {
        immersionTl.to(
          mountain,
          {
            y: -110,
            scale: 1.28,
            transformOrigin: '50% 85%',
            ease: 'none',
          },
          0
        );
      }

      // Internal mountain image slight extra parallax
      if (mountainImg) {
        immersionTl.to(
          mountainImg,
          {
            y: -35,
            ease: 'none',
          },
          0
        );
      }

      // Headline and controls fade and float upward
      if (headline || subtext || buttons) {
        immersionTl.to(
          [headline, subtext, buttons],
          {
            y: -80,
            opacity: 0,
            stagger: 0.05,
            ease: 'power1.in',
          },
          0
        );
      }

      // Organic terrain shapes at the bottom expand to embrace the Live Map
      if (terrainShapes) {
        immersionTl.to(
          terrainShapes,
          {
            scaleY: 1.5,
            y: -60,
            backgroundColor: '#FFE48C',
            ease: 'none',
          },
          0
        );
      }
    });

    // ==========================================
    // Mobile (< 768px)
    // Graceful, touch-friendly, no heavy scroll scrubbing
    // ==========================================
    mm.add('(max-width: 767px)', () => {
      const mobileTl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });

      if (mountain) {
        mobileTl.fromTo(mountain, { opacity: 0, y: 35, scale: 0.96 }, { opacity: 1, y: 0, scale: 1 });
      }

      if (headline) {
        mobileTl.fromTo(headline, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.4');
      }

      if (subtext) {
        mobileTl.fromTo(subtext, { opacity: 0, y: 15 }, { opacity: 1, y: 0 }, '-=0.4');
      }

      if (buttons) {
        mobileTl.fromTo(buttons.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.1 }, '-=0.3');
      }

      // Subtle, lightweight mobile parallax
      if (mountain) {
        gsap.to(mountain, {
          y: -40,
          scale: 1.08,
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });
  }, container);

  return () => {
    ctx.revert();
  };
};
