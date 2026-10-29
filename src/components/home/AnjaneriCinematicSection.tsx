import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnjaneriTerrainViewer, MarkerData } from '../map/AnjaneriTerrainViewer';
import { MapPin, Compass, Mountain, ArrowRight, Eye, Layers, ShieldCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AnjaneriCinematicSectionProps {
  onOpenBookingModal?: (trekId: string) => void;
}

export const AnjaneriCinematicSection: React.FC<AnjaneriCinematicSectionProps> = ({ onOpenBookingModal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const visualWrapperRef = useRef<HTMLDivElement>(null);
  const photoLayerRef = useRef<HTMLImageElement>(null);
  const headerBlockRef = useRef<HTMLDivElement>(null);
  const telemetryBadgeRef = useRef<HTMLDivElement>(null);
  const markerPinRef = useRef<HTMLDivElement>(null);
  const checkpointsBarRef = useRef<HTMLDivElement>(null);
  const ctaCardRef = useRef<HTMLDivElement>(null);

  const [activeMode, setActiveMode] = useState<'cinema' | '3d' | 'map'>('cinema');
  const [scrollProgress, setScrollProgress] = useState(0);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      // ==========================================
      // Desktop & Tablet: Pinned Storytelling Sequence
      // ==========================================
      mm.add('(min-width: 768px)', () => {
        const pinTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=140%',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setScrollProgress(self.progress);
            },
          },
        });

        // 1. Framing change: landscape visual expands into the viewport
        if (visualWrapperRef.current) {
          pinTimeline.fromTo(
            visualWrapperRef.current,
            { scale: 0.91, borderRadius: '40px' },
            { scale: 1, borderRadius: '28px', duration: 0.4, ease: 'power2.out' },
            0
          );
        }

        if (photoLayerRef.current) {
          pinTimeline.fromTo(
            photoLayerRef.current,
            { scale: 1.15, y: -20 },
            { scale: 1.0, y: 0, duration: 0.6, ease: 'none' },
            0
          );
        }

        // 2. Location Title & Coordinates badge enter at specific timeline positions
        if (headerBlockRef.current) {
          pinTimeline.fromTo(
            headerBlockRef.current,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
            0.15
          );
        }

        if (telemetryBadgeRef.current) {
          pinTimeline.fromTo(
            telemetryBadgeRef.current,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' },
            0.25
          );
        }

        // 3. Location marker pin drops onto the plateau peak
        if (markerPinRef.current) {
          pinTimeline.fromTo(
            markerPinRef.current,
            { opacity: 0, y: -45, scale: 0.6 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'bounce.out' },
            0.35
          );
        }

        // 4. Supporting trek checkpoints reveal progressively
        if (checkpointsBarRef.current) {
          pinTimeline.fromTo(
            checkpointsBarRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
            0.5
          );
        }

        // 5. Booking telemetry card emerges
        if (ctaCardRef.current) {
          pinTimeline.fromTo(
            ctaCardRef.current,
            { opacity: 0, y: 35, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' },
            0.65
          );
        }
      });

      // Mobile setup
      mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          [headerBlockRef.current, visualWrapperRef.current, checkpointsBarRef.current],
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.7,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div id="anjeneri-section" ref={containerRef} className="relative w-full bg-white">
      <div
        ref={pinnedStageRef}
        className="w-full min-h-[92vh] md:h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-brand-pastelYellow/25 via-white to-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Top Control Bar: Header & Interactive Mode Selectors */}
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4 z-20">
          <div ref={headerBlockRef}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pastelYellow border border-brand-orange/30 text-xs font-bold uppercase tracking-wider text-brand-orange mb-1">
              <Mountain className="w-3.5 h-3.5" />
              <span>Scene 3 &bull; Anjaneri Hills Plateau</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-black leading-tight">
              Anjaneri Hills &mdash; Sacred Sahyadri Ridge
            </h2>

            <p className="text-neutral-700 text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
              Explore the iconic 1,280m tableland plateau, ancient 12th-century rock-cut caves, and the natural footprint lake near Nashik, Maharashtra.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2.5">
            <div
              ref={telemetryBadgeRef}
              className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-800 bg-white border border-neutral-300 px-3 py-1.5 rounded-full shadow-sm"
            >
              <Compass className="w-4 h-4 text-brand-orange" />
              <span className="font-semibold">19.9238° N, 73.5786° E &bull; 1,280m</span>
            </div>

            <div className="flex bg-neutral-200/90 p-1 rounded-full border border-neutral-300 shadow-inner">
              <button
                onClick={() => setActiveMode('cinema')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeMode === 'cinema'
                    ? 'bg-black text-brand-primaryYellow shadow'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                Cinematic View
              </button>
              <button
                onClick={() => setActiveMode('3d')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeMode === '3d'
                    ? 'bg-black text-brand-primaryYellow shadow'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                3D Terrain
              </button>
              <button
                onClick={() => setActiveMode('map')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeMode === 'map'
                    ? 'bg-black text-brand-primaryYellow shadow'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                Trail Map
              </button>
            </div>
          </div>
        </div>

        {/* Center Display: Cinematic Landscape vs 3D WebGL Terrain vs 2D Trail Map */}
        <div
          ref={visualWrapperRef}
          className="max-w-7xl mx-auto w-full flex-1 my-3 sm:my-4 rounded-[32px] overflow-hidden border-4 border-black shadow-2xl relative bg-[#FED547] min-h-[360px] sm:min-h-[440px]"
        >
          {activeMode === 'cinema' && (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              {/* Photo layer with smooth scroll parallax */}
              <img
                ref={photoLayerRef}
                src="/Assets/Anjenery-hills-1.png"
                alt="Anjaneri Hills Plateau and Green Slopes"
                className="w-full h-full object-cover object-center select-none"
                loading="eager"
              />

              {/* Gradient depth vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

              {/* Dropping Location Marker Pin on Plateau Peak */}
              <div
                ref={markerPinRef}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
              >
                <div className="w-12 h-12 rounded-full bg-brand-primaryYellow border-3 border-black flex items-center justify-center text-black shadow-2xl relative">
                  <MapPin className="w-6 h-6 fill-black text-black" />
                  <span className="absolute -inset-2 rounded-full border-2 border-white/80 beacon-pulse pointer-events-none" />
                </div>
                <div className="mt-2 bg-black/90 text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-brand-primaryYellow shadow-lg backdrop-blur-md">
                  Anjaneri Summit &bull; 4,200 ft (1,280 m)
                </div>
              </div>

              {/* Overlay HUD Telemetry Card */}
              <div
                ref={ctaCardRef}
                className="absolute bottom-5 right-5 z-20 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border-2 border-black rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-primaryYellow border border-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl text-black leading-snug">
                      Anjaneri Hills Expedition
                    </h4>
                    <p className="text-xs font-bold text-brand-orange">
                      2-3 hrs &bull; Easy - Moderate &bull; Certified Guide
                    </p>
                    <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                      Trail features stone-cut steps, panoramic Western Ghats views, perennial footprint lake, and Hanuman birthplace shrine.
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Standard Pass</span>
                    <span className="text-sm font-extrabold text-black">₹850 <span className="text-[10px] font-normal">/ person</span></span>
                  </div>

                  <button
                    onClick={() => onOpenBookingModal ? onOpenBookingModal('trek-anjeneri-hills') : null}
                    className="px-4 py-2 bg-brand-primaryYellow hover:bg-brand-orange text-white text-xs font-extrabold uppercase rounded-full shadow-md transition transform hover:scale-105 flex items-center gap-1.5"
                  >
                    <span>BOOK NOW !</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Left corner caption */}
              <div className="absolute bottom-5 left-5 z-20 hidden sm:block bg-black/80 text-white text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-neutral-700">
                <span className="text-brand-primaryYellow font-bold">Sahyadri Heritage Ridge:</span> Volcanic basalt tableland
              </div>
            </div>
          )}

          {activeMode === '3d' && (
            <div className="w-full h-full">
              <AnjaneriTerrainViewer
                scrollProgress={scrollProgress}
                onOpenBookingModal={onOpenBookingModal}
              />
            </div>
          )}

          {activeMode === 'map' && (
            <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#FED547]">
              <img
                src="/Assets/Anjeneri-Hills-map-1.png"
                alt="Anjaneri Hills Illustrated Trail Map"
                className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-md select-none"
              />
              <div className="absolute bottom-5 left-5 bg-black/85 text-white text-xs px-4 py-2 rounded-2xl backdrop-blur-sm border border-neutral-700">
                <span className="font-bold text-brand-primaryYellow">Illustrated Trail Overview:</span> Footprint Ridge &amp; Cave Cisterns
              </div>
            </div>
          )}
        </div>

        {/* Bottom Trail Checkpoint Badges */}
        <div
          ref={checkpointsBarRef}
          className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-3 z-20"
        >
          <div className="bg-white border-2 border-black rounded-2xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-lightYellow flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
              1
            </div>
            <div className="min-w-0">
              <h5 className="font-heading text-sm text-black leading-tight truncate">Base Village</h5>
              <p className="text-[10px] text-neutral-600 truncate">1,950 ft &bull; Trailhead</p>
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-lightYellow flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
              2
            </div>
            <div className="min-w-0">
              <h5 className="font-heading text-sm text-black leading-tight truncate">12th C. Caves</h5>
              <p className="text-[10px] text-neutral-600 truncate">2,600 ft &bull; Rock Cisterns</p>
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-lightYellow flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
              3
            </div>
            <div className="min-w-0">
              <h5 className="font-heading text-sm text-black leading-tight truncate">Footprint Lake</h5>
              <p className="text-[10px] text-neutral-600 truncate">3,800 ft &bull; Tableland Basin</p>
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-primaryYellow flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
              4
            </div>
            <div className="min-w-0">
              <h5 className="font-heading text-sm text-black leading-tight truncate">Temple Summit</h5>
              <p className="text-[10px] text-neutral-600 truncate">4,200 ft &bull; 1,280 m Peak</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
