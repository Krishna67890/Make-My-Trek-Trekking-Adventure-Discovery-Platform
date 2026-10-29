import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useData } from '../../context/DataContext';
import { Star, MessageSquareQuote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TestimonialsSection: React.FC = () => {
  const { reviews } = useData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        // Section header entrance
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

        // Staggered speech bubble card entrance
        if (cardsRef.current) {
          const bubbles = cardsRef.current.querySelectorAll('.testimonial-bubble');
          gsap.fromTo(
            bubbles,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.16,
              duration: 0.85,
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
            cardsRef.current.querySelectorAll('.testimonial-bubble'),
            { opacity: 0, y: 25 },
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
      id="testimonials-section"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-mountain-theme overflow-hidden border-t-2 border-black/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Canva */}
        <div ref={headerRef} className="flex items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          <img
            src="/Assets/Testimonials-Logo.png"
            alt="Testimonials Badge"
            className="w-16 h-14 sm:w-24 sm:h-16 object-contain flex-shrink-0 drop-shadow-sm select-none"
            loading="lazy"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-pastelYellow border border-brand-orange/30 text-[11px] font-bold uppercase tracking-wider text-brand-orange mb-1">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Scene 6 &bull; Authentic Community Voice</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black leading-tight">
              Testimonials
            </h2>

            <p className="font-body text-neutral-600 text-xs sm:text-sm md:text-base mt-1">
              Real feedback from trekkers who explored the Sahyadri mountains with us.
            </p>
          </div>
        </div>

        {/* Speech-bubble cards layout matching Canva main page.png */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start"
        >
          {/* Card 1: Nilambari Nehete (exact from Canva design) */}
          <div className="testimonial-bubble speech-bubble speech-bubble-tail-bottom-left p-6 sm:p-8 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl text-brand-grayBrown leading-tight">
                  Nilambari Nehete
                </h3>
                <span className="text-xs font-semibold text-neutral-800">
                  Anjaneri Hills Trekker &bull; Verified Review
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-grayBrown text-brand-grayBrown" />
                ))}
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-neutral-900 leading-relaxed font-medium">
              &ldquo;An extraordinary experience trekking to Anjaneri Hills! The guides ensured safety throughout the rock steps and the view of the footprint lake was completely magical. Everything was handled seamlessly by Make My Trek.&rdquo;
            </p>
          </div>

          {/* Card 2: Rohan Deshmukh */}
          <div className="testimonial-bubble speech-bubble speech-bubble-tail-bottom-right p-6 sm:p-8 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl text-brand-grayBrown leading-tight">
                  Rohan Deshmukh
                </h3>
                <span className="text-xs font-semibold text-neutral-800">
                  Kalsubai Sunrise Trek &bull; Verified Review
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-grayBrown text-brand-grayBrown" />
                ))}
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-neutral-900 leading-relaxed font-medium">
              &ldquo;The 3D terrain preview on the platform gave us exact trail insight before starting. The real-time updates from our guide made our group feel confident and completely safe. Highly recommended!&rdquo;
            </p>
          </div>

          {/* Card 3: Tanvi Shinde */}
          <div className="testimonial-bubble speech-bubble speech-bubble-tail-bottom-left p-6 sm:p-8 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl text-brand-grayBrown leading-tight">
                  Tanvi Shinde
                </h3>
                <span className="text-xs font-semibold text-neutral-800">
                  Harishchandragad Trek &bull; Verified Review
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-grayBrown text-brand-grayBrown" />
                ))}
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-neutral-900 leading-relaxed font-medium">
              &ldquo;The sunrise from the highest peak of Maharashtra was an unforgettable memory. The breakfast at the local village was authentic and delicious.&rdquo;
            </p>
          </div>

          {/* Card 4: Amit Joshi */}
          <div className="testimonial-bubble speech-bubble speech-bubble-tail-bottom-right p-6 sm:p-8 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl text-brand-grayBrown leading-tight">
                  Amit Joshi
                </h3>
                <span className="text-xs font-semibold text-neutral-800">
                  Sandhan Valley Trek &bull; Verified Review
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-grayBrown text-brand-grayBrown" />
                ))}
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-neutral-900 leading-relaxed font-medium">
              &ldquo;Top-notch rappelling safety gear, patient instructors, and flawless coordination. Make My Trek sets the benchmark for trekking platforms in India.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
