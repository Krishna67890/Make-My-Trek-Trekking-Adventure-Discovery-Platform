import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  MessageSquareQuote,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Sparkles,
  Mountain,
  UserCheck,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TestimonialsSection: React.FC = () => {
  const { reviews, addReview, deleteReview, approvedTreks } = useData();
  const { user } = useAuth();

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrekId, setSelectedTrekId] = useState(approvedTreks[0]?.id || 'trek-anjeneri-hills');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

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
      });
    },
    { scope: sectionRef }
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!user) {
      setFormError('Please sign in to submit your verified testimonial.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 15) {
      setFormError('Please write at least 15 characters describing your trail experience.');
      return;
    }

    const matchedTrek = approvedTreks.find((t) => t.id === selectedTrekId);
    const trekTitle = matchedTrek ? matchedTrek.title : 'Sahyadri Expedition';

    addReview(
      selectedTrekId,
      rating,
      comment.trim(),
      user.displayName || 'Sahyadri Explorer',
      user.uid,
      user.avatarUrl || '/Assets/boy.png',
      trekTitle,
      user.role === 'ORGANIZER' ? 'Certified Expedition Leader' : 'Verified Sahyadri Trekker'
    );

    setComment('');
    setRating(5);
    setModalOpen(false);
    setSuccessNotice('✓ Your testimonial has been published live!');
    setTimeout(() => setSuccessNotice(''), 4500);
  };

  return (
    <section
      id="testimonials-section"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-mountain-theme overflow-hidden border-t-2 border-black/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src="/Assets/Testimonials-Logo.png"
              alt="Testimonials Badge"
              className="w-16 h-14 sm:w-24 sm:h-16 object-contain flex-shrink-0 drop-shadow-sm select-none"
              loading="lazy"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-pastelYellow border border-brand-orange/30 text-[11px] font-bold uppercase tracking-wider text-brand-orange mb-1">
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Scene 6 &bull; Real Authenticated Community Voices</span>
              </div>

              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black leading-tight">
                Testimonials
              </h2>

              <p className="font-body text-neutral-600 text-xs sm:text-sm md:text-base mt-1">
                Real feedback and star ratings submitted by authenticated platform trekkers.
              </p>
            </div>
          </div>

          {/* Action Button: Authenticated User Can Add Testimonial */}
          <div className="flex-shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs sm:text-sm uppercase tracking-wide border-2 border-black shadow-lg hover:bg-black hover:text-white transition transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Share Your Trail Story</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-extrabold text-xs sm:text-sm uppercase tracking-wide border-2 border-black shadow-lg hover:bg-brand-primaryYellow hover:text-black transition transform hover:scale-105 active:scale-95"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In to Leave a Review</span>
              </Link>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Real Testimonials Grid */}
        <div ref={cardsRef}>
          {reviews.length === 0 ? (
            <div className="bg-white border-4 border-black rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-400">
                <Mountain className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-3xl sm:text-4xl text-black">
                Be The First Verified Summit Reviewer!
              </h3>
              <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                All previous mock entries have been cleared. Sign in with your real account, pick an expedition, and share your genuine mountain experience.
              </p>
              <div className="pt-2">
                {user ? (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="px-6 py-3 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow hover:bg-black hover:text-white transition"
                  >
                    + Write Testimonial
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="inline-block px-6 py-3 rounded-full bg-black text-white font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow hover:bg-brand-primaryYellow hover:text-black transition"
                  >
                    Sign In to Post Review
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
              {reviews.map((rev, idx) => {
                const isEven = idx % 2 === 0;
                const isAuthorOrAdmin = user && (user.uid === rev.reviewerId || user.role === 'ADMIN');
                const avatarSrc = rev.reviewerAvatar || '/Assets/boy.png';

                return (
                  <div
                    key={rev.id}
                    className={`testimonial-bubble speech-bubble ${
                      isEven ? 'speech-bubble-tail-bottom-left' : 'speech-bubble-tail-bottom-right'
                    } p-6 sm:p-8 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300 relative group`}
                  >
                    <div>
                      {/* Top Author Details & Rating */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={avatarSrc}
                            alt={rev.reviewerName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-black shadow-sm flex-shrink-0 bg-amber-50"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Assets/boy.png';
                            }}
                          />
                          <div>
                            <h3 className="font-heading text-xl sm:text-2xl text-brand-grayBrown leading-tight">
                              {rev.reviewerName}
                            </h3>
                            <span className="text-[11px] font-bold text-neutral-800 flex items-center gap-1.5 mt-0.5">
                              <span>{rev.trekTitle || 'Sahyadri Expedition'}</span>
                              <span>&bull;</span>
                              <span className="text-emerald-700 font-extrabold uppercase text-[10px]">
                                Verified
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating
                                  ? 'fill-brand-grayBrown text-brand-grayBrown'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="font-body text-xs sm:text-sm text-neutral-900 leading-relaxed font-medium">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    {/* Footer: Date & Delete button */}
                    <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-[11px] text-neutral-600">
                      <span>
                        Posted on{' '}
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>

                      {isAuthorOrAdmin && (
                        <button
                          type="button"
                          onClick={() => deleteReview(rev.id)}
                          className="opacity-0 group-hover:opacity-100 transition text-rose-600 hover:text-rose-800 flex items-center gap-1 text-[11px] font-bold"
                          title="Delete this testimonial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Write Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatarUrl || '/Assets/boy.png'}
                  alt="My Avatar"
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                />
                <div>
                  <h3 className="font-heading text-2xl text-black">
                    Submit Your Testimonial
                  </h3>
                  <p className="text-xs text-neutral-600">
                    Posting as <strong className="text-black">{user?.displayName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Trek Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  Select Expedition
                </label>
                <select
                  value={selectedTrekId}
                  onChange={(e) => setSelectedTrekId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primaryYellow"
                >
                  {approvedTreks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.location})
                    </option>
                  ))}
                  <option value="custom-sahyadri">Other Sahyadri Mountain Trail</option>
                </select>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Your Overall Rating ({rating} Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setRating(starNum)}
                      onMouseEnter={() => setHoverRating(starNum)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          starNum <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Comment */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  Your Trail Review &amp; Experience
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details on trail conditions, scenery, sunrise, guide leadership, safety equipment, or local homestay food..."
                  className="w-full p-3.5 rounded-xl border-2 border-black text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primaryYellow"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow hover:bg-black hover:text-white transition"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
