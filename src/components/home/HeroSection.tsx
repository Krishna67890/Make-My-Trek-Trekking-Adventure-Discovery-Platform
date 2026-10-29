import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, Map, ChevronDown, Mountain, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedContentRef = useRef<HTMLDivElement>(null);
  const bgPhotoLayerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const mountainRef = useRef<HTMLDivElement>(null);
  const mountainImgRef = useRef<HTMLImageElement>(null);
  const terrainShapesRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const transitionBadgeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      // ==========================================
      // Desktop: Pinned Cinematic Mountain Immersion
      // ==========================================
      mm.add('(min-width: 768px)', () => {
        // Initial Entrance Timeline
        const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Fade and scale the mountain photograph into place
        if (bgPhotoLayerRef.current) {
          entranceTl.fromTo(
            bgPhotoLayerRef.current,
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1.0, duration: 1.4, ease: 'sine.out' }
          );
        }

        // Mountain artwork emergence with lift
        if (mountainRef.current) {
          entranceTl.fromTo(
            mountainRef.current,
            { opacity: 0, y: 75, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 1.25, ease: 'power2.out' },
            '-=1.1'
          );
        }

        // Line-by-line / word-by-word masked reveal for headline
        if (headlineRef.current) {
          const wordInners = headlineRef.current.querySelectorAll('.hero-word-inner');
          entranceTl.fromTo(
            wordInners,
            { y: '115%', opacity: 0, rotateZ: 2 },
            {
              y: '0%',
              opacity: 1,
              rotateZ: 0,
              duration: 0.85,
              stagger: 0.08,
              ease: 'power3.out',
            },
            '-=0.9'
          );
        }

        if (subtextRef.current) {
          entranceTl.fromTo(
            subtextRef.current,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.75 },
            '-=0.5'
          );
        }

        if (buttonsRef.current) {
          entranceTl.fromTo(
            Array.from(buttonsRef.current.children),
            { opacity: 0, y: 20, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.12,
              ease: 'back.out(1.4)',
            },
            '-=0.4'
          );
        }

        // SCENE B: Pinned Mountain & Background Transformation
        // The hero pins while scrolling, zooming the mountain background and foreground
        // at different rates to create true parallax depth!
        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Background photograph scales & repositions smoothly
        if (bgPhotoLayerRef.current) {
          scrubTl.to(
            bgPhotoLayerRef.current,
            {
              scale: 1.18,
              y: 60,
              ease: 'none',
              duration: 1,
            },
            0
          );
        }

        // Foreground mountain artwork zooms into the foreground faster
        if (mountainRef.current) {
          scrubTl.to(
            mountainRef.current,
            {
              scale: 1.48,
              y: -115,
              transformOrigin: '50% 88%',
              duration: 1,
              ease: 'power1.inOut',
            },
            0
          );
        }

        // Headline & controls transition smoothly out
        if (headlineRef.current) {
          scrubTl.to(
            headlineRef.current,
            {
              y: -85,
              opacity: 0,
              scale: 0.92,
              letterSpacing: '0.04em',
              duration: 0.45,
              ease: 'power2.in',
            },
            0
          );
        }

        if (subtextRef.current) {
          scrubTl.to(
            subtextRef.current,
            {
              y: -50,
              opacity: 0,
              duration: 0.35,
              ease: 'power2.in',
            },
            0
          );
        }

        if (buttonsRef.current) {
          scrubTl.to(
            buttonsRef.current,
            {
              y: -40,
              opacity: 0,
              scale: 0.88,
              duration: 0.35,
              ease: 'power2.in',
            },
            0
          );
        }

        // Expanding organic yellow/orange shapes
        if (terrainShapesRef.current) {
          scrubTl.to(
            terrainShapesRef.current,
            {
              scaleY: 2.2,
              y: -85,
              backgroundColor: '#FFE48C',
              duration: 0.7,
              ease: 'power2.out',
            },
            0.25
          );
        }

        // Reveal map transition banner
        if (transitionBadgeRef.current) {
          scrubTl.fromTo(
            transitionBadgeRef.current,
            { opacity: 0, y: 50, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' },
            0.55
          );
        }
      });

      // Mobile setup
      mm.add('(max-width: 767px)', () => {
        const mobileTl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.75 } });

        if (mountainRef.current) {
          mobileTl.fromTo(mountainRef.current, { opacity: 0, y: 35 }, { opacity: 1, y: 0 });
        }

        if (headlineRef.current) {
          mobileTl.fromTo(headlineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.4');
        }

        if (subtextRef.current) {
          mobileTl.fromTo(subtextRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0 }, '-=0.4');
        }

        if (buttonsRef.current) {
          mobileTl.fromTo(buttonsRef.current.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.1 }, '-=0.3');
        }

        if (mountainRef.current) {
          gsap.to(mountainRef.current, {
            y: -50,
            scale: 1.12,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });
    },
    { scope: containerRef }
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="hero-section" ref={containerRef} className="relative w-full">
      <div
        ref={pinnedContentRef}
        className="w-full min-h-[92vh] md:h-screen flex flex-col items-center justify-between overflow-hidden relative pt-6 sm:pt-10 pb-0"
      >
        {/* Full-width Mountain Photography Theme Background with Gradient Overlay */}
        <div
          ref={bgPhotoLayerRef}
          className="absolute inset-0 bg-mountain-hero pointer-events-none -z-20 will-change-transform"
        />

        {/* Warm Sunrise Ambient Overlay Glow */}
        <div
          ref={ambientGlowRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-brand-pastelYellow/50 via-brand-lightYellow/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10"
        />

        {/* Hero Header & Typography */}
        <div className="max-w-4xl mx-auto px-4 text-center z-10 pt-3 sm:pt-6">
          {/* Sahyadri Sub-badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-pastelYellow/85 border border-brand-orange/30 text-xs font-semibold text-brand-grayBrown mb-3 tracking-wider uppercase shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Sahyadri Mountain Expeditions &bull; Nashik, Maharashtra</span>
          </div>

          {/* Headline with line-by-line / word-by-word masked reveal */}
          <h1
            ref={headlineRef}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black font-normal tracking-wide leading-tight mb-4 select-none drop-shadow-xs"
          >
            <span className="hero-word mr-3 sm:mr-4">
              <span className="hero-word-inner">&ldquo;Discover</span>
            </span>
            <span className="hero-word mr-3 sm:mr-4">
              <span className="hero-word-inner">Your</span>
            </span>
            <span className="hero-word mr-3 sm:mr-4">
              <span className="hero-word-inner">Next</span>
            </span>
            <span className="hero-word">
              <span className="hero-word-inner">Adventure&rdquo;</span>
            </span>
          </h1>

          <p
            ref={subtextRef}
            className="font-body text-base sm:text-lg md:text-xl text-neutral-900 font-medium max-w-2xl mx-auto mb-7 tracking-wide drop-shadow-xs"
          >
            Book handpicked treks with live updates &amp; expert guides
          </p>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <Link
              to="/treks"
              className="btn-brand-pill bg-brand-primaryYellow text-white hover:bg-brand-orange text-sm sm:text-base shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 group"
            >
              <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
              <span>Explore Treks</span>
            </Link>

            <button
              onClick={() => scrollTo('live-map')}
              className="btn-brand-pill bg-brand-primaryYellow text-white hover:bg-brand-orange text-sm sm:text-base shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 group"
            >
              <Map className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
              <span>Live Map</span>
            </button>
          </div>
        </div>

        {/* Mountain Artwork & Layered Transition */}
        <div className="relative w-full max-w-7xl mx-auto mt-2 sm:mt-4 flex flex-col items-center justify-end">
          {/* Scroll Transition Badge (Reveals during pinned scrub) */}
          <div
            ref={transitionBadgeRef}
            className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-30 opacity-0 pointer-events-none text-center px-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white border border-brand-primaryYellow/60 shadow-2xl">
              <Mountain className="w-4 h-4 text-brand-primaryYellow" />
              <span className="text-xs font-bold tracking-widest uppercase text-brand-primaryYellow">
                Entering 3D Earth Explorer &bull; Anjaneri Hills
              </span>
            </div>
            <h3 className="font-heading text-2xl sm:text-4xl text-black mt-2 drop-shadow-sm">
              Trimbakeshwar Range &bull; 1,280m
            </h3>
          </div>

          {/* Mountain Artwork with Deep Scaling Transformation */}
          <div
            ref={mountainRef}
            className="w-full relative z-10 px-2 sm:px-6 will-change-transform"
          >
            <img
              ref={mountainImgRef}
              src="/Assets/Mountains-1.png"
              alt="Sahyadri Mountain Landscape Illustration"
              className="w-full h-auto object-contain max-h-[440px] sm:max-h-[500px] drop-shadow-md select-none pointer-events-none mx-auto will-change-transform"
              loading="eager"
            />
          </div>

          {/* Expanding Organic Yellow Terrain Bridge Layer */}
          <div
            ref={terrainShapesRef}
            className="w-full h-14 sm:h-24 bg-gradient-to-b from-transparent via-brand-pastelYellow/80 to-brand-lightYellow/95 -mt-8 sm:-mt-14 relative z-20"
          >
            {/* Scroll Indicator */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition cursor-pointer"
              onClick={() => scrollTo('live-map')}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-800">
                Scroll to explore Earth &amp; terrain
              </span>
              <ChevronDown className="w-4 h-4 text-neutral-800 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
