import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const WhyChooseUsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: 'Expert Guides',
      image: '/Assets/Expert-Guides-Logo-1.png',
      description:
        'Certified Wilderness First Responders (WFR) and mountaineering alumni with extensive local terrain and navigation knowledge.',
      parallaxSpeed: -35,
    },
    {
      title: 'Real Time Trek Updates',
      image: '/Assets/Real-Time-track-Updates-1.png',
      description:
        'Live weather broadcasts, trailhead conditions, checkpoint check-ins, and safety notifications sent straight to your phone.',
      parallaxSpeed: -15,
    },
    {
      title: 'Safe & Comfort Stays',
      image: '/Assets/Safe-Comfort-Stays-1.png',
      description:
        'Verified village homestays and sanitized camping shelters providing warm organic Maharashtrian hospitality.',
      parallaxSpeed: -25,
    },
    {
      title: 'Pocket Friendly Packages',
      image: '/Assets/Packet-Friendly-Pacages.png',
      description:
        'Transparent pricing covering permits, safety equipment, meals, and guidance with zero hidden commissions.',
      parallaxSpeed: -40,
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        // Section Header entrance
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        );

        if (subtitleRef.current) {
          gsap.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: subtitleRef.current,
                start: 'top 85%',
              },
            }
          );
        }

        // Background organic shape expands with scroll
        if (waveRef.current) {
          gsap.fromTo(
            waveRef.current,
            { scale: 0.8, opacity: 0.3 },
            {
              scale: 1.05,
              opacity: 0.85,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            }
          );
        }

        // Staggered parallax for cards
        if (cardsRef.current) {
          const cardEls = cardsRef.current.querySelectorAll('.why-choose-card');
          cardEls.forEach((card, i) => {
            const speed = features[i]?.parallaxSpeed || -20;
            gsap.to(card, {
              y: speed,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          });

          // Initial coordinated entrance
          gsap.fromTo(
            cardEls,
            { opacity: 0, y: 55, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.14,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 82%',
              },
            }
          );
        }
      });

      mm.add('(max-width: 767px)', () => {
        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.querySelectorAll('.why-choose-card'),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.65,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 88%',
              },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="why-us-section"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-mountain-theme overflow-hidden border-t-2 border-black/10"
    >
      {/* Background Organic Yellow Shape matching Canva design */}
      <div
        ref={waveRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[80%] bg-gradient-to-r from-brand-pastelYellow/40 via-brand-lightYellow/50 to-brand-pastelYellow/30 rounded-[120px] transform -rotate-1 pointer-events-none -z-10 blur-2xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-pastelYellow border border-brand-orange/30 text-xs font-bold uppercase tracking-wider text-brand-orange mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Scene 5 &bull; The Make My Trek Standard</span>
          </div>

          <h2
            ref={headerRef}
            className="font-heading text-4xl sm:text-5xl md:text-6xl text-black leading-tight"
          >
            Why Choose us?
          </h2>

          <p
            ref={subtitleRef}
            className="font-body text-neutral-700 text-sm sm:text-base mt-3 leading-relaxed"
          >
            Every expedition is engineered with mountaineering safety protocols, local community partnerships, and transparent services.
          </p>
        </div>

        {/* 4 Feature Cards Grid matching Canva design */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {features.map((feat, index) => (
            <div
              key={index}
              className="why-choose-card bg-[#FED547] border-[2.5px] border-black rounded-[32px] p-6 sm:p-7 shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center justify-between group will-change-transform"
            >
              <div className="w-full flex flex-col items-center">
                {/* Feature Graphic from Canva assets */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-5 group-hover:scale-108 transition-transform duration-300">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm select-none"
                    loading="lazy"
                  />
                </div>

                {/* Feature Title matching Canva condensed style */}
                <h3 className="font-heading text-2xl sm:text-[26px] text-black leading-tight mb-3">
                  {feat.title}
                </h3>
              </div>

              {/* Feature Description */}
              <p className="font-body text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal mt-2">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
