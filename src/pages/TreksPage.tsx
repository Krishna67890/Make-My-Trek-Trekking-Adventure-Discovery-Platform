import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { BookingModal } from '../components/booking/BookingModal';
import { Search, SlidersHorizontal, MapPin, Clock, ArrowRight, X } from 'lucide-react';
import { Trek } from '../types';

export const TreksPage: React.FC = () => {
  const { approvedTreks } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bookingTrek, setBookingTrek] = useState<Trek | null>(null);

  const filteredTreks = useMemo(() => {
    return approvedTreks.filter((trek) => {
      const matchesSearch =
        trek.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trek.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === 'ALL' || trek.difficulty === selectedDifficulty;

      const matchesPrice = trek.price <= maxPrice;

      return matchesSearch && matchesDifficulty && matchesPrice;
    });
  }, [approvedTreks, searchQuery, selectedDifficulty, maxPrice]);

  return (
    <div className="min-h-screen bg-mountain-theme">
      {/* Top Banner with Mountain Trek Photo */}
      <div
        className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b-2 border-black text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8, 12, 18, 0.75) 0%, rgba(10, 14, 20, 0.9) 100%), url('/Assets/Anjenery-hills-1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left">
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white drop-shadow-md">
              Treks
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-brand-primaryYellow uppercase tracking-widest mt-1">
              Handpicked Sahyadri trails with certified expedition leaders
            </p>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-black shadow-md hover:bg-neutral-50 transition text-sm font-bold text-black"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-orange" />
            <span>Filters</span>
          </button>
        </div>

        {/* Clean Search Bar */}
        <div className="max-w-4xl mx-auto mt-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trek name, fort, or location (e.g. Anjaneri, Kalsubai, Nashik)..."
              className="w-full pl-14 pr-12 py-4 rounded-full bg-white text-black placeholder-neutral-500 font-medium text-sm sm:text-base border-2 border-black shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primaryYellow transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-neutral-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {filtersOpen && (
          <div className="max-w-4xl mx-auto mt-6 bg-white border-2 border-black rounded-3xl p-6 shadow-xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-heading text-xl text-black">Refine Treks</h3>
              <button
                onClick={() => {
                  setSelectedDifficulty('ALL');
                  setMaxPrice(3000);
                  setSearchQuery('');
                }}
                className="text-xs text-neutral-500 hover:text-black font-semibold"
              >
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Trail Difficulty
                </label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'Easy - Moderate', 'Moderate', 'Challenging'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition ${
                        selectedDifficulty === diff
                          ? 'bg-[#FED547] border-black text-black'
                          : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:border-black'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  <span>Max Budget</span>
                  <span className="text-brand-orange font-extrabold">Up to ₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-primaryYellow cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>₹500</span>
                  <span>₹3,000</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Treks Grid matching Canva design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-semibold text-neutral-600">
            Showing <b className="text-black">{filteredTreks.length}</b> verified treks
          </p>
        </div>

        {filteredTreks.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-300 p-8">
            <h3 className="font-heading text-3xl text-neutral-800 mb-2">No Treks Match Your Filter</h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
              Try adjusting your search criteria or resetting filters to explore all available Sahyadri adventures.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('ALL');
                setMaxPrice(3000);
              }}
              className="px-6 py-2.5 rounded-full bg-brand-primaryYellow text-white font-bold text-sm shadow hover:bg-brand-orange transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredTreks.map((trek, idx) => (
              <div
                key={trek.id}
                className={`border-2 border-black rounded-[32px] p-4 sm:p-5 shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between ${
                  idx === 0 ? 'bg-[#FED547]' : 'bg-white'
                }`}
              >
                <div>
                  {/* Photo Header */}
                  <div className="w-full h-44 rounded-[22px] overflow-hidden border border-black/15 relative bg-neutral-100">
                    <img
                      src={trek.images[0] || '/Assets/Anjenery-hills-1.png'}
                      alt={trek.title}
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/95 px-2.5 py-0.5 rounded-full text-xs font-extrabold text-black border border-black/20 shadow-sm">
                      ₹{trek.price}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl text-black mt-4 leading-tight">
                    {trek.title}
                  </h3>

                  {/* Location Address */}
                  <div className="flex items-start gap-1 text-[11px] text-neutral-700 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-tight">{trek.address || trek.location}</span>
                  </div>

                  {/* Duration & Difficulty */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-black">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      <span>{trek.duration}</span>
                    </div>

                    <span className="px-2.5 py-0.5 bg-[#9FC131]/80 border border-black/20 rounded-full text-[10px] font-bold text-black">
                      {trek.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-800 leading-relaxed mt-3 line-clamp-3">
                    {trek.shortDescription || trek.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-black/10 flex flex-col gap-2">
                  <button
                    onClick={() => setBookingTrek(trek)}
                    className="w-full py-2 rounded-full text-center text-xs font-extrabold uppercase tracking-wider bg-brand-primaryYellow text-white hover:bg-brand-orange shadow transition"
                  >
                    BOOK NOW !
                  </button>

                  <Link
                    to={`/treks/${trek.slug}`}
                    className="w-full py-1.5 rounded-full text-center text-xs font-semibold text-neutral-800 hover:text-black border border-black/20 hover:bg-black/5 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingTrek && (
        <BookingModal
          trek={bookingTrek}
          isOpen={Boolean(bookingTrek)}
          onClose={() => setBookingTrek(null)}
        />
      )}
    </div>
  );
};
