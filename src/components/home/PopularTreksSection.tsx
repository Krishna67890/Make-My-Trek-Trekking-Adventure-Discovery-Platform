import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useData } from '../../context/DataContext';
import { Clock, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PopularTreksProps {
  onOpenBookingModal?: (trekId: string) => void;
}

export const PopularTreksSection: React.FC<PopularTreksProps> = ({ onOpenBookingModal }) => {
  const { approvedTreks } = useData();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  // Top approved treks
  const displayTreks = approvedTreks.slice(0, 3);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      // ==========================================
      // Desktop: Pinned Coordinated Card Stagger
      // ==========================================
      mm.add('(min-width: 768px)', () => {
        const pinTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=125%',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Highlight selected card based on scroll progress
              const prog = self.progress;
              if (prog < 0.45) setHighlightedIndex(0);
              else if (prog < 0.75) setHighlightedIndex(1);
              else setHighlightedIndex(2);
            },
          },
        });

        // 1. Introduce section heading with masked line reveal
        if (headerRef.current) {
          pinTimeline.fromTo(
            headerRef.current,
            { opacity: 0, y: 40, letterSpacing: '0.04em' },
            { opacity: 1, y: 0, letterSpacing: '0em', duration: 0.35, ease: 'power3.out' },
            0
          );
        }

        // 2. Coordinated card stagger & clip-path imagery reveal
        if (cardsContainerRef.current) {
          const cards = cardsContainerRef.current.querySelectorAll('.trek-card-item');
          const cardImages = cardsContainerRef.current.querySelectorAll('.trek-card-img');

          pinTimeline.fromTo(
            cards,
            { opacity: 0, y: 70, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.15,
              ease: 'power3.out',
            },
            0.15
          );

          pinTimeline.fromTo(
            cardImages,
            { scale: 1.15, filter: 'contrast(0.9) brightness(0.9)' },
            {
              scale: 1,
              filter: 'contrast(1) brightness(1)',
              duration: 0.6,
              stagger: 0.15,
              ease: 'power2.out',
            },
            0.2
          );
        }
      });

      // Mobile: Clean viewport stagger without screen pinning
      mm.add('(max-width: 767px)', () => {
        if (cardsContainerRef.current) {
          const cards = cardsContainerRef.current.querySelectorAll('.trek-card-item');
          gsap.fromTo(
            cards,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.14,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: 'top 85%',
              },
            }
          );
        }
      });
    },
    { scope: containerRef, dependencies: [approvedTreks] }
  );

  return (
    <div id="treks-section" ref={containerRef} className="relative w-full bg-mountain-theme overflow-hidden border-t-2 border-black/10">
      <div
        ref={pinnedStageRef}
        className="w-full min-h-[92vh] md:h-screen flex flex-col justify-center overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-pastelYellow border border-brand-orange/30 text-xs font-bold uppercase tracking-wider text-brand-orange mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scene 4 &bull; Verified Expeditions</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black leading-tight">
              Popular Treks
            </h2>

            <p className="font-body text-neutral-600 text-xs sm:text-sm md:text-base mt-1.5 max-w-xl leading-relaxed">
              Certified Sahyadri trails led by registered Wilderness First Responders with live GPS updates, village homestays, and transparent pricing.
            </p>
          </div>

          <Link
            to="/treks"
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold text-black hover:text-brand-orange transition py-2 px-4 rounded-full border-2 border-black/10 hover:border-black/30 bg-neutral-50 hover:bg-white"
          >
            <span>View All Treks</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Trek Cards Grid (matching Canva yellow card design) */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
        >
          {displayTreks.map((trek, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={trek.id}
                className={`trek-card-item bg-[#FED547] border-[2.5px] border-black rounded-[32px] p-5 shadow-card transition-all duration-400 flex flex-col justify-between transform ${
                  isHighlighted ? 'scale-[1.02] shadow-2xl ring-2 ring-brand-orange' : 'hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Card Image */}
                  <div className="w-full h-48 sm:h-52 rounded-[24px] overflow-hidden border-2 border-black/20 shadow-inner relative bg-neutral-200 group">
                    <img
                      src={trek.images[0] || '/Assets/Anjenery-hills-1.png'}
                      alt={trek.title}
                      className="trek-card-img w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-600 ease-out"
                      loading="lazy"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-black border-2 border-black shadow-sm">
                      ₹{trek.price}
                    </div>

                    {/* Safety Verification Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/85 text-white backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand-primaryYellow" />
                      <span>Certified Route</span>
                    </div>
                  </div>

                  {/* Trek Title */}
                  <h3 className="font-heading text-2xl sm:text-3xl text-black mt-4 leading-tight hover:text-brand-orange transition-colors">
                    {trek.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-start gap-1.5 text-xs text-neutral-800 mt-2 font-medium">
                    <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{trek.address || trek.location}</span>
                  </div>

                  {/* Duration & Difficulty */}
                  <div className="flex items-center gap-2.5 mt-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-black bg-white/80 px-2.5 py-1 rounded-full border border-black/10">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      <span>{trek.duration}</span>
                    </div>

                    <span className="px-3.5 py-1 bg-[#9FC131] border border-black/20 rounded-full text-xs font-bold text-black shadow-sm">
                      {trek.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-800 leading-relaxed mt-3.5 line-clamp-3 font-normal">
                    {trek.shortDescription || trek.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3.5 border-t-2 border-black/10 flex flex-col sm:flex-row items-center gap-2">
                  <Link
                    to={`/treks/${trek.slug}`}
                    className="w-full sm:w-1/2 py-2.5 px-3 rounded-full text-center text-xs font-bold bg-white text-black border-2 border-black hover:bg-neutral-100 transition shadow-sm"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => onOpenBookingModal ? onOpenBookingModal(trek.id) : null}
                    className="w-full sm:w-1/2 py-2.5 px-3 rounded-full text-center text-xs font-extrabold uppercase tracking-wider bg-brand-primaryYellow text-white hover:bg-brand-orange border-2 border-transparent hover:border-black shadow-md transition transform hover:scale-[1.02] active:scale-95"
                  >
                    BOOK NOW !
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
