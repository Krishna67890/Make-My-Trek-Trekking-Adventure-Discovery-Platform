import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useData } from '../../context/DataContext';
import { Newspaper, CheckCircle2, AlertCircle, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const NewsletterSection: React.FC = () => {
  const { subscribeNewsletter } = useData();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        });

        if (cardRef.current) {
          tl.fromTo(
            cardRef.current,
            { opacity: 0, scale: 0.88, rotateZ: -8 },
            { opacity: 1, scale: 1, rotateZ: -3, duration: 0.75, ease: 'back.out(1.4)' }
          );
        }

        if (formRef.current) {
          tl.fromTo(
            formRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' },
            '-=0.45'
          );
        }
      });
    },
    { scope: sectionRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    // Try backend API if running, otherwise use DataContext
    try {
      const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        const localResult = subscribeNewsletter(email);
        setStatus(localResult.success ? 'success' : 'error');
        setMessage(localResult.message);
        if (localResult.success) setEmail('');
      }
    } catch (err) {
      const localResult = subscribeNewsletter(email);
      setStatus(localResult.success ? 'success' : 'error');
      setMessage(localResult.message);
      if (localResult.success) setEmail('');
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 bg-[#FED547] overflow-hidden border-t-2 border-black/10"
    >
      {/* Decorative Top Wave Accent */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
          {/* Left: Newspaper Icon Card matching Canva design with ambient floating */}
          <div
            ref={cardRef}
            className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 bg-white border-4 border-black rounded-3xl p-4 shadow-xl flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform animate-ambient-float"
          >
            <div className="border-b-2 border-black pb-1 flex items-center justify-between">
              <span className="font-extrabold text-[11px] sm:text-xs tracking-wider text-black">NEWS</span>
              <Newspaper className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="space-y-1.5 py-1">
              <div className="w-full h-1.5 bg-black/70 rounded" />
              <div className="w-5/6 h-1.5 bg-black/40 rounded" />
              <div className="w-4/6 h-1.5 bg-brand-orange rounded" />
            </div>
            <div className="w-full h-4 bg-brand-primaryYellow/60 rounded flex items-center px-1">
              <span className="text-[9px] font-bold text-neutral-800">EXPEDITION</span>
            </div>
          </div>

          {/* Center & Right: Heading & Form */}
          <div className="flex-1 w-full text-center lg:text-left">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-black mb-6 leading-tight">
              Stay Updated with Latest Treks !!
            </h2>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-2xl"
            >
              <label
                htmlFor="newsletter-email"
                className="font-heading text-xl sm:text-2xl text-black whitespace-nowrap"
              >
                Email :
              </label>

              <div className="flex-1 w-full relative">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="your.email@example.com"
                  className="w-full px-5 py-3 rounded-full bg-white text-black text-sm border-2 border-black shadow-inner focus:outline-none focus:ring-2 focus:ring-black transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#A85A14] hover:bg-[#85450c] text-white font-bold text-sm sm:text-base border-2 border-black shadow-md transition transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>

            {/* Validation / Confirmation Feedback */}
            {status === 'success' && (
              <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-emerald-900 bg-white/70 px-4 py-2 rounded-xl inline-flex border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-red-900 bg-white/70 px-4 py-2 rounded-xl inline-flex border border-red-300">
                <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
