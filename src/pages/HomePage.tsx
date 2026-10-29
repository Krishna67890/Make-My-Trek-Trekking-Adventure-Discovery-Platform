import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { LiveMapSection } from '../components/home/LiveMapSection';
import { DiscoverSection } from '../components/home/DiscoverSection';
import { PopularTreksSection } from '../components/home/PopularTreksSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { BookingModal } from '../components/booking/BookingModal';
import { SectionProgressNav } from '../components/common/SectionProgressNav';
import { AtmosphericCanvas } from '../components/common/AtmosphericCanvas';
import { useData } from '../context/DataContext';

const HOMEPAGE_SECTIONS = [
  { id: 'hero-section', label: 'Explore', number: '01' },
  { id: 'live-map', label: 'Live Map', number: '02' },
  { id: 'discover-section', label: 'Discover', number: '03' },
  { id: 'treks-section', label: 'Treks', number: '04' },
  { id: 'why-us-section', label: 'Why Us', number: '05' },
  { id: 'testimonials-section', label: 'Reviews', number: '06' },
];

export const HomePage: React.FC = () => {
  const { treks } = useData();
  const [bookingPayload, setBookingPayload] = useState<{
    trekId: string;
    customPrice?: number;
    travelOrigin?: string;
    travelDistanceKm?: number;
  } | null>(null);

  const selectedTrek =
    treks.find((t) => t.id === bookingPayload?.trekId) ||
    treks.find((t) => t.id === 'trek-anjeneri-hills') ||
    treks[0];

  return (
    <div className="w-full min-h-screen bg-mountain-theme relative">
      {/* Mont-Fort inspired ambient background atmosphere */}
      <AtmosphericCanvas />

      {/* Floating Section Progress Indicator */}
      <SectionProgressNav sections={HOMEPAGE_SECTIONS} />

      {/* SCENE A & B: Cinematic Hero & Pinned Mountain Transformation */}
      <HeroSection />

      {/* SCENE B TRANSITION: Live Map & 3D Earth Globe with Anjaneri Hills Flight & Actual Local Map */}
      <LiveMapSection
        onOpenBookingModal={(trekId, customPrice, travelOrigin, travelDistanceKm) =>
          setBookingPayload({ trekId, customPrice, travelOrigin, travelDistanceKm })
        }
      />

      {/* SCENE C: Discover Section with Difficulty & Region Filters */}
      <DiscoverSection onOpenBookingModal={(trekId) => setBookingPayload({ trekId })} />

      {/* SCENE D: Pinned Popular Treks & Coordinated Stagger */}
      <PopularTreksSection onOpenBookingModal={(trekId) => setBookingPayload({ trekId })} />

      {/* SCENE E: Why Choose Us (Scrubbed Multi-Speed Parallax) */}
      <WhyChooseUsSection />

      {/* SCENE F: Testimonials (Canva Speech-Bubble Stagger) */}
      <TestimonialsSection />

      {/* SCENE G: Newsletter (Organic Yellow Transition) */}
      <NewsletterSection />

      {/* Central Booking Modal with GPS Travel Distance & Telemetry */}
      {selectedTrek && (
        <BookingModal
          trek={selectedTrek}
          isOpen={Boolean(bookingPayload)}
          onClose={() => setBookingPayload(null)}
          customPricePerPerson={bookingPayload?.customPrice}
          travelOrigin={bookingPayload?.travelOrigin}
          travelDistanceKm={bookingPayload?.travelDistanceKm}
        />
      )}
    </div>
  );
};
