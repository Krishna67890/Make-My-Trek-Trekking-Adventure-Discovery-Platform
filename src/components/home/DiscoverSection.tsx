import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useData } from '../../context/DataContext';
import { Search, Filter, X, Clock, MapPin, ArrowRight, ShieldCheck, Sparkles, Globe, DollarSign } from 'lucide-react';
import { TrekDifficulty } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface DiscoverSectionProps {
  onOpenBookingModal?: (trekId: string) => void;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({ onOpenBookingModal }) => {
  const { approvedTreks } = useData();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterBoxRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedPrice, setSelectedPrice] = useState<string>('ALL');

  const difficulties: { label: string; value: string }[] = [
    { label: 'All Difficulties', value: 'ALL' },
    { label: 'Easy', value: 'Easy' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Challenging', value: 'Challenging' },
  ];

  const regions: { label: string; value: string }[] = [
    { label: 'All Regions', value: 'ALL' },
    { label: 'Nashik / Trimbak', value: 'Nashik' },
    { label: 'Igatpuri / Kalsubai', value: 'Igatpuri' },
    { label: 'Bhandardara / Sandhan', value: 'Bhandardara' },
    { label: 'Western Ghats', value: 'Maharashtra' },
  ];

  const priceRanges: { label: string; value: string }[] = [
    { label: 'All Budgets', value: 'ALL' },
    { label: 'Under ₹1,000', value: '1000' },
    { label: 'Under ₹1,500', value: '1500' },
    { label: 'Under ₹2,500', value: '2500' },
  ];

  // Client-side filtering on actual approved treks without unnecessary Firestore spam
  const filteredTreks = useMemo(() => {
    return approvedTreks.filter((trek) => {
      // Search term (title, subtitle, location, address)
      const matchesSearch =
        !searchTerm.trim() ||
        trek.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trek.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trek.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trek.subtitle && trek.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === 'ALL' ||
        trek.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());

      // Region filter
      const matchesRegion =
        selectedRegion === 'ALL' ||
        trek.location.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        trek.address.toLowerCase().includes(selectedRegion.toLowerCase());

      // Price filter
      const matchesPrice =
        selectedPrice === 'ALL' || trek.price <= parseInt(selectedPrice, 10);

      return matchesSearch && matchesDifficulty && matchesRegion && matchesPrice;
    });
  }, [approvedTreks, searchTerm, selectedDifficulty, selectedRegion, selectedPrice]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('ALL');
    setSelectedRegion('ALL');
    setSelectedPrice('ALL');
  };

  const hasActiveFilters = searchTerm !== '' || selectedDifficulty !== 'ALL' || selectedRegion !== 'ALL' || selectedPrice !== 'ALL';

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
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
      }

      if (filterBoxRef.current) {
        gsap.fromTo(
          filterBoxRef.current,
          { opacity: 0, y: 25, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: filterBoxRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const scrollToLiveMap = () => {
    const el = document.getElementById('live-map');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="discover-section" ref={sectionRef} className="py-20 sm:py-28 relative overflow-hidden bg-mountain-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-pastelYellow border border-brand-orange/30 text-xs font-bold uppercase tracking-wider text-brand-orange mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scene 3 &bull; Discover Handpicked Trails</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black leading-tight">
            Discover Sahyadri Treks
          </h2>

          <p className="font-body text-neutral-700 text-sm sm:text-base mt-2 leading-relaxed">
            Filter certified mountain expeditions by difficulty, region, and budget. Verified guides, GPS trail logs, and village homestays included.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={scrollToLiveMap}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black text-brand-primaryYellow text-xs font-bold shadow-md hover:bg-neutral-800 transition transform hover:scale-105"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore Trails on 3D Earth Globe</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar (Polished Canva / Mont-Fort card styling) */}
        <div ref={filterBoxRef} className="bg-white/95 backdrop-blur-md border-3 border-black rounded-[32px] p-5 sm:p-6 shadow-xl mb-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by trek or location..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-neutral-50 text-black text-xs sm:text-sm border-2 border-black/15 focus:border-black focus:outline-none transition shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Difficulty Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-full bg-neutral-50 text-black text-xs sm:text-sm font-semibold border-2 border-black/15 focus:border-black focus:outline-none transition cursor-pointer"
              >
                {difficulties.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-full bg-neutral-50 text-black text-xs sm:text-sm font-semibold border-2 border-black/15 focus:border-black focus:outline-none transition cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-full bg-neutral-50 text-black text-xs font-semibold border-2 border-black/15 focus:border-black focus:outline-none transition cursor-pointer"
              >
                {priceRanges.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter count & clear */}
          {hasActiveFilters && (
            <div className="mt-3.5 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-700">
                Found {filteredTreks.length} matching treks
              </span>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 font-bold text-brand-orange hover:underline"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {filteredTreks.length === 0 ? (
          <div className="text-center py-16 bg-white/90 backdrop-blur-sm border-2 border-black rounded-3xl p-8 max-w-xl mx-auto shadow-md">
            <Filter className="w-10 h-10 text-brand-orange mx-auto mb-3 opacity-60" />
            <h3 className="font-heading text-2xl text-black">No Treks Match Your Criteria</h3>
            <p className="text-neutral-600 text-xs sm:text-sm mt-1">
              Try relaxing your search terms or clearing the difficulty and region filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2 rounded-full bg-brand-primaryYellow text-black font-bold text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredTreks.map((trek) => (
              <div
                key={trek.id}
                className="bg-[#FED547] border-[2.5px] border-black rounded-[32px] p-5 shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Card Photo */}
                  <div className="w-full h-52 sm:h-56 rounded-[24px] overflow-hidden border-2 border-black/20 shadow-inner relative bg-neutral-200 group">
                    <img
                      src={trek.images[0] || '/Assets/Anjenery-hills-1.png'}
                      alt={trek.title}
                      className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-600 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-black border-2 border-black shadow-sm">
                      ₹{trek.price}
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/85 text-white backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand-primaryYellow" />
                      <span>Approved Guide</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl sm:text-3xl text-black mt-4 leading-tight hover:text-brand-orange transition-colors">
                    {trek.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-start gap-1.5 text-xs text-neutral-800 mt-2 font-medium">
                    <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{trek.address || trek.location}</span>
                  </div>

                  {/* Badges */}
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
