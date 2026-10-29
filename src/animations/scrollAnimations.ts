import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateStaggerCards = (
  elements: Element[] | NodeListOf<Element>,
  trigger: Element | null
) => {
  if (!trigger || elements.length === 0) return () => {};

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 45, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    mm.add('(max-width: 767px)', () => {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, trigger);

  return () => ctx.revert();
};

export const animateSectionHeader = (
  title: HTMLElement | null,
  subtitle?: HTMLElement | null
) => {
  if (!title) return () => {};

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set([title, subtitle].filter(Boolean), { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      title,
      { opacity: 0, y: 32, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }
    );

    if (subtitle) {
      tl.fromTo(
        subtitle,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
        '-=0.45'
      );
    }
  }, title);

  return () => ctx.revert();
};

export const animateOrganicWave = (element: HTMLElement | null, trigger: Element | null) => {
  if (!element || !trigger) return () => {};

  const ctx = gsap.context(() => {
    gsap.fromTo(
      element,
      { scaleY: 0.7, opacity: 0.4 },
      {
        scaleY: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    );
  }, trigger);

  return () => ctx.revert();
};
