import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from '../components/booking/BookingModal';
import { AnjaneriTerrainViewer } from '../components/map/AnjaneriTerrainViewer';
import {
  MapPin,
  Clock,
  Compass,
  Mountain,
  Users,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const TrekDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { treks, reviews, addReview } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [showTerrainMap, setShowTerrainMap] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Find trek by slug or id
  const trek = treks.find((t) => t.slug === slug || t.id === slug) || treks[0];

  const trekReviews = reviews.filter((r) => r.trekId === trek.id);
  const averageRating = trekReviews.length > 0
    ? (trekReviews.reduce((acc, r) => acc + r.rating, 0) / trekReviews.length).toFixed(1)
    : '5.0';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addReview(
      trek.id,
      newRating,
      newComment,
      user?.displayName || 'Adventurer',
      user?.uid || 'guest-user'
    );

    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Treks</span>
        </button>
      </div>

      {/* Hero Image Section matching Canva 3.png */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] rounded-[36px] overflow-hidden border-2 border-black shadow-xl bg-neutral-900">
          <img
            src={trek.images[1] || trek.images[0] || '/Assets/3.png'}
            alt={trek.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Title & Location matching Canva 3.png typography */}
          <div className="absolute bottom-8 left-6 sm:left-10 right-6 text-white">
            <span className="px-3.5 py-1 bg-brand-primaryYellow text-black font-extrabold text-xs uppercase tracking-wider rounded-full shadow mb-3 inline-block">
              {trek.difficulty} &bull; {trek.duration}
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-white drop-shadow-md">
              {trek.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-neutral-200 text-xs sm:text-sm font-medium">
              <MapPin className="w-4 h-4 text-brand-primaryYellow flex-shrink-0" />
              <span>{trek.address || trek.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Booking Column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Columns: Trek Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#FED547]/30 border-2 border-black rounded-2xl p-4 text-center">
                <Mountain className="w-5 h-5 mx-auto text-brand-orange mb-1" />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Peak Altitude
                </span>
                <span className="font-heading text-xl text-black">
                  {trek.coordinates.altitude ? `${trek.coordinates.altitude} m` : '1,280 m'}
                </span>
              </div>

              <div className="bg-[#FED547]/30 border-2 border-black rounded-2xl p-4 text-center">
                <Clock className="w-5 h-5 mx-auto text-brand-orange mb-1" />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Duration
                </span>
                <span className="font-heading text-xl text-black">{trek.duration}</span>
              </div>

              <div className="bg-[#FED547]/30 border-2 border-black rounded-2xl p-4 text-center">
                <Compass className="w-5 h-5 mx-auto text-brand-orange mb-1" />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Difficulty
                </span>
                <span className="font-heading text-xl text-black">{trek.difficulty}</span>
              </div>

              <div className="bg-[#FED547]/30 border-2 border-black rounded-2xl p-4 text-center">
                <Users className="w-5 h-5 mx-auto text-brand-orange mb-1" />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Group Capacity
                </span>
                <span className="font-heading text-xl text-black">{trek.capacity} Trekkers</span>
              </div>
            </div>

            {/* Description & Overview */}
            <div className="space-y-4">
              <h2 className="font-heading text-3xl sm:text-4xl text-black">
                About the Expedition
              </h2>
              <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal whitespace-pre-line">
                {trek.description}
              </p>
            </div>

            {/* Interactive 3D Terrain Exploration Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-black">
                    Interactive 3D Trail &amp; Terrain
                  </h3>
                  <p className="text-xs text-neutral-600">
                    Inspect geographic checkpoints, elevation contours, and route lines.
                  </p>
                </div>
                <button
                  onClick={() => setShowTerrainMap(!showTerrainMap)}
                  className="px-4 py-2 rounded-full border-2 border-black text-xs font-bold bg-[#FED547] text-black hover:bg-brand-primaryYellow transition"
                >
                  {showTerrainMap ? 'Hide 3D Map' : 'Explore 3D Terrain'}
                </button>
              </div>

              {showTerrainMap && (
                <div className="animate-fadeIn">
                  <AnjaneriTerrainViewer />
                </div>
              )}
            </div>

            {/* Itinerary */}
            <div className="space-y-5">
              <h3 className="font-heading text-3xl text-black">Trek Itinerary</h3>
              <div className="space-y-4">
                {trek.itinerary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-neutral-50 rounded-2xl border-2 border-black/10 flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FED547] border border-black flex items-center justify-center font-bold text-black text-xs flex-shrink-0 mt-0.5">
                      {item.day}
                    </div>
                    <div>
                      <h4 className="font-heading text-xl text-black">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-neutral-700 mt-1 leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions and Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-6">
                <h4 className="font-heading text-2xl text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <span>Inclusions</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950">
                  {trek.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-rose-50/70 border-2 border-rose-300 rounded-3xl p-6">
                <h4 className="font-heading text-2xl text-rose-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-700" />
                  <span>Exclusions</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-rose-950">
                  {trek.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 flex-shrink-0" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Certified Organizer Badge */}
            <div className="bg-neutral-900 text-white rounded-3xl p-6 border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-primaryYellow tracking-wider">
                  Expedition Hosted By
                </span>
                <h4 className="font-heading text-2xl text-white">{trek.organizerName}</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-md">
                  Certified Wilderness First Responder (WFR) with verified forest permits and emergency tracking protocols.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-2xl border border-neutral-700">
                <ShieldCheck className="w-5 h-5 text-brand-primaryYellow" />
                <span className="text-xs font-semibold text-neutral-200">Verified Partner</span>
              </div>
            </div>

            {/* Verified Trekker Reviews & Write Review Form */}
            <div className="space-y-6 pt-6 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-3xl text-black">Trekkers Reviews</h3>
                <div className="flex items-center gap-1.5 bg-[#FED547] px-3 py-1 rounded-full text-black font-bold text-xs border border-black/20">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span>{averageRating} ({trekReviews.length} reviews)</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {trekReviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-heading text-lg text-black">{rev.reviewerName}</h5>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-brand-orange text-brand-orange'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <span className="text-[10px] text-neutral-400 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Write Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white border-2 border-black rounded-2xl p-5 space-y-3 shadow-sm">
                <h4 className="font-heading text-xl text-black">Share Your Trail Experience</h4>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-600">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewRating(s)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= newRating
                              ? 'fill-brand-primaryYellow text-brand-primaryYellow'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell fellow trekkers about trail conditions, guides, and views..."
                  className="w-full p-3 rounded-xl border border-neutral-300 text-xs focus:border-black focus:outline-none"
                  required
                />

                <div className="flex items-center justify-between">
                  {reviewSubmitted ? (
                    <span className="text-xs font-semibold text-emerald-700">
                      Thank you! Your verified review has been posted.
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-white font-bold text-xs shadow flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#FED547] border-4 border-black rounded-[36px] p-6 sm:p-7 shadow-2xl space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-neutral-800">
                  Starting Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-heading text-4xl sm:text-5xl text-black font-normal">
                    ₹{trek.price}
                  </span>
                  <span className="text-xs text-neutral-700 font-semibold">/ per person</span>
                </div>
              </div>

              {/* Slots remaining indicator */}
              <div className="bg-white/80 border border-black/20 rounded-2xl p-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800">Available Slots:</span>
                <span className="font-extrabold text-black bg-brand-primaryYellow px-2.5 py-0.5 rounded-full border border-black/10">
                  {trek.capacity - (trek.bookedCount || 0)} spots left
                </span>
              </div>

              {/* Upcoming dates badge list */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Upcoming Batches
                </label>
                <div className="space-y-1.5">
                  {trek.availableDates.slice(0, 3).map((d) => (
                    <div
                      key={d}
                      className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-xl border border-black/15 font-medium"
                    >
                      <span className="flex items-center gap-1.5 text-black">
                        <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                        {new Date(d).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">Open</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Booking Button matching Canva design */}
              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full py-4 px-6 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-white font-extrabold text-base uppercase tracking-wider border-2 border-black shadow-xl transition transform hover:scale-[1.02]"
              >
                BOOK NOW !
              </button>

              <div className="text-center text-[11px] text-neutral-800 font-medium space-y-1">
                <p>&bull; 100% Verified Trail Safety Protocols</p>
                <p>&bull; Instant Razorpay Confirmation &amp; Invoice</p>
                <p>&bull; Free cancellation up to 48 hrs prior</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        trek={trek}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};
