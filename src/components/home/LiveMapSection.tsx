import React, { useState } from 'react';
import { EarthGlobeViewer } from '../map/EarthGlobeViewer';
import { AnjaneriLocalMap } from '../map/AnjaneriLocalMap';
import { Globe, Map as MapIcon, Image as ImageIcon, Sparkles, Compass } from 'lucide-react';

interface LiveMapSectionProps {
  onOpenBookingModal?: (
    trekId: string,
    customPrice?: number,
    travelOrigin?: string,
    travelDistanceKm?: number
  ) => void;
}

export const LiveMapSection: React.FC<LiveMapSectionProps> = ({ onOpenBookingModal }) => {
  // 3 Modes as requested:
  // 1. 'globe' = 3D Earth Globe with route search & flight arc
  // 2. 'local' = Actual Local Map with live GPS tracking, real coordinates, time & cost
  // 3. 'illustration' = 2D Trail Illustration & Topographic Overview Map
  const [activeView, setActiveView] = useState<'globe' | 'local' | 'illustration'>('globe');

  return (
    <section id="live-map" className="relative w-full py-16 sm:py-24 bg-mountain-theme overflow-hidden border-t-2 border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 sm:mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-pastelYellow border border-brand-orange/30 text-xs font-bold uppercase tracking-wider text-brand-orange">
              <Globe className="w-3.5 h-3.5" />
              <span>Interactive Earth Globe &bull; Actual Local Map &bull; Trail Illustration</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black mt-2 leading-tight">
              Live Map &amp; Earth Explorer
            </h2>

            <p className="text-neutral-700 text-sm sm:text-base max-w-2xl mt-1.5 leading-relaxed">
              Explore our 3D Earth Globe with Great-Circle flight navigation, switch into the actual local geographic topographic map with live GPS tracking, time and cost, or inspect the detailed trail map illustration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher: 3 Options Restored */}
            <div className="flex bg-neutral-900/90 p-1.5 rounded-full border border-neutral-700 shadow-xl backdrop-blur-md">
              <button
                onClick={() => setActiveView('globe')}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeView === 'globe'
                    ? 'bg-brand-primaryYellow text-black shadow-md'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>3D Earth Globe</span>
              </button>

              <button
                onClick={() => setActiveView('local')}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeView === 'local'
                    ? 'bg-brand-primaryYellow text-black shadow-md'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span>Actual Local Map</span>
              </button>

              <button
                onClick={() => setActiveView('illustration')}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeView === 'illustration'
                    ? 'bg-brand-primaryYellow text-black shadow-md'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Trail Illustration</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Map Display: 3 Modes */}
        <div className="relative w-full">
          {activeView === 'globe' && (
            <EarthGlobeViewer
              onExploreLocalMap={() => setActiveView('local')}
              onOpenBookingModal={onOpenBookingModal}
            />
          )}

          {activeView === 'local' && (
            <AnjaneriLocalMap
              onBackToGlobe={() => setActiveView('globe')}
              onOpenBookingModal={onOpenBookingModal}
            />
          )}

          {activeView === 'illustration' && (
            <div className="relative w-full h-[580px] sm:h-[680px] rounded-[32px] overflow-hidden border-4 border-black shadow-2xl bg-[#FED547] flex items-center justify-center p-4">
              <img
                src="/Assets/Anjeneri-Hills-map-1.png"
                alt="Anjaneri Hills Illustrated Trail Map"
                className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-md select-none"
              />
              <div className="absolute top-5 left-5 bg-black/85 text-white text-xs px-4 py-2 rounded-2xl backdrop-blur-sm border border-neutral-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primaryYellow animate-ping" />
                <span>
                  <b className="text-brand-primaryYellow">Illustrated Trail Overview:</b> Hanuman Birthplace Temple, Footprint Lake &amp; 12th Century Jain Caves
                </span>
              </div>

              <div className="absolute bottom-5 right-5 flex gap-2">
                <button
                  onClick={() => setActiveView('local')}
                  className="px-4 py-2 bg-black text-brand-primaryYellow hover:bg-neutral-900 text-xs font-extrabold uppercase rounded-full shadow-lg border border-brand-primaryYellow/40 transition"
                >
                  Open Actual Live Map
                </button>
                <button
                  onClick={() => onOpenBookingModal ? onOpenBookingModal('trek-anjeneri-hills') : null}
                  className="px-4 py-2 bg-brand-primaryYellow text-black hover:bg-brand-orange hover:text-white text-xs font-extrabold uppercase rounded-full shadow-lg border border-black transition"
                >
                  Book Trek ₹850
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informational Checklist Cards below Map */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 sm:mt-10">
          <div className="bg-white/95 backdrop-blur-md border-2 border-black rounded-3xl p-5 shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-brand-lightYellow border border-black flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-heading text-xl text-black">Birthplace Heritage</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Revered as the birthplace of Lord Hanuman with the sacred Anjani Mata temple atop the high volcanic plateau.
              </p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md border-2 border-black rounded-3xl p-5 shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-brand-lightYellow border border-black flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-heading text-xl text-black">Footprint Lake</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Perennial water plateau reservoir naturally contoured in the shape of a divine right footprint.
              </p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md border-2 border-black rounded-3xl p-5 shadow-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-brand-lightYellow border border-black flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-heading text-xl text-black">12th Century Caves</h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Historical Jain rock carvings and natural water cisterns sculpted into the volcanic cliff line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
