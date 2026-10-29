import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trek, OrganizerApplication, Booking, Review, NewsletterSubscriber } from '../types';
import { INITIAL_TREKS, INITIAL_ORGANIZERS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from '../data/mockData';

interface DataContextType {
  treks: Trek[];
  approvedTreks: Trek[];
  organizers: OrganizerApplication[];
  bookings: Booking[];
  reviews: Review[];
  newsletterSubscribers: NewsletterSubscriber[];
  addTrek: (trek: Omit<Trek, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'bookedCount'>) => Trek;
  updateTrek: (id: string, updates: Partial<Trek>) => void;
  approveTrek: (id: string) => void;
  rejectTrek: (id: string, reason: string) => void;
  applyOrganizer: (application: Omit<OrganizerApplication, 'id' | 'status' | 'submittedAt'>) => void;
  approveOrganizer: (id: string) => void;
  rejectOrganizer: (id: string, reason: string) => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'bookingStatus' | 'paymentStatus'>) => Booking;
  confirmBookingPayment: (bookingId: string, razorpayPaymentId: string, razorpayOrderId?: string) => void;
  cancelBooking: (bookingId: string, reason: string) => void;
  addReview: (
    trekId: string,
    rating: number,
    comment: string,
    reviewerName: string,
    reviewerId: string,
    reviewerAvatar?: string,
    trekTitle?: string,
    reviewerRole?: string
  ) => void;
  deleteReview: (reviewId: string) => void;
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [treks, setTreks] = useState<Trek[]>(() => {
    const saved = localStorage.getItem('mmt_treks');
    return saved ? JSON.parse(saved) : INITIAL_TREKS;
  });

  const [organizers, setOrganizers] = useState<OrganizerApplication[]>(() => {
    const saved = localStorage.getItem('mmt_organizers');
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mmt_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mmt_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out old dummy reviews so only real authenticated user reviews appear
        const cleaned = Array.isArray(parsed)
          ? parsed.filter((r) => !['rev-1', 'rev-2', 'rev-3'].includes(r.id))
          : [];
        return cleaned;
      } catch {
        return [];
      }
    }
    return INITIAL_REVIEWS;
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(() => {
    const saved = localStorage.getItem('mmt_newsletter');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mmt_treks', JSON.stringify(treks));
  }, [treks]);

  useEffect(() => {
    localStorage.setItem('mmt_organizers', JSON.stringify(organizers));
  }, [organizers]);

  useEffect(() => {
    localStorage.setItem('mmt_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('mmt_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mmt_newsletter', JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers]);

  const approvedTreks = treks.filter((t) => t.status === 'APPROVED');

  const addTrek = (trekData: Omit<Trek, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'bookedCount'>): Trek => {
    const newTrek: Trek = {
      ...trekData,
      id: `trek-${Date.now()}`,
      status: 'PENDING', // New submissions start as PENDING
      bookedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTreks((prev) => [newTrek, ...prev]);
    return newTrek;
  };

  const updateTrek = (id: string, updates: Partial<Trek>) => {
    setTreks((prev) =>
      prev.map((trek) => {
        if (trek.id === id) {
          // If critical safety, route, price, or itinerary details change, require re-review
          const requiresReReview =
            updates.price !== undefined ||
            updates.routeCoordinates !== undefined ||
            updates.itinerary !== undefined ||
            updates.difficulty !== undefined;

          return {
            ...trek,
            ...updates,
            status: requiresReReview ? 'PENDING' : trek.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return trek;
      })
    );
  };

  const approveTrek = (id: string) => {
    setTreks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'APPROVED', rejectionReason: undefined, updatedAt: new Date().toISOString() } : t))
    );
  };

  const rejectTrek = (id: string, reason: string) => {
    setTreks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'REJECTED', rejectionReason: reason, updatedAt: new Date().toISOString() } : t))
    );
  };

  const applyOrganizer = (appData: Omit<OrganizerApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: OrganizerApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
    setOrganizers((prev) => [newApp, ...prev]);
  };

  const approveOrganizer = (id: string) => {
    setOrganizers((prev) =>
      prev.map((org) => (org.id === id ? { ...org, status: 'APPROVED', reviewedAt: new Date().toISOString() } : org))
    );
  };

  const rejectOrganizer = (id: string, reason: string) => {
    setOrganizers((prev) =>
      prev.map((org) =>
        org.id === id ? { ...org, status: 'REJECTED', rejectionReason: reason, reviewedAt: new Date().toISOString() } : org
      )
    );
  };

  const createBooking = (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'bookingStatus' | 'paymentStatus'>
  ): Booking => {
    const targetTrek = treks.find((t) => t.id === bookingData.trekId);
    if (!targetTrek) {
      throw new Error('Trek not found');
    }
    if (targetTrek.status !== 'APPROVED') {
      throw new Error('Bookings are only permitted for approved treks');
    }
    const currentBooked = targetTrek.bookedCount || 0;
    const requestedSlots = bookingData.participants.length;
    if (currentBooked + requestedSlots > targetTrek.capacity) {
      throw new Error(`Insufficient slots available. Only ${targetTrek.capacity - currentBooked} spots remain.`);
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `MMT-BK-${Date.now().toString().slice(-6)}`,
      bookingStatus: 'PENDING_PAYMENT',
      paymentStatus: 'CREATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const confirmBookingPayment = (bookingId: string, razorpayPaymentId: string, razorpayOrderId?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          // Increment booked count for the trek
          setTreks((trekList) =>
            trekList.map((t) =>
              t.id === b.trekId ? { ...t, bookedCount: (t.bookedCount || 0) + b.participants.length } : t
            )
          );

          return {
            ...b,
            bookingStatus: 'CONFIRMED',
            paymentStatus: 'CAPTURED',
            razorpayPaymentId,
            razorpayOrderId: razorpayOrderId || b.razorpayOrderId,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
  };

  const cancelBooking = (bookingId: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          // Decrement booked count if previously confirmed
          if (b.bookingStatus === 'CONFIRMED') {
            setTreks((trekList) =>
              trekList.map((t) =>
                t.id === b.trekId ? { ...t, bookedCount: Math.max(0, (t.bookedCount || 0) - b.participants.length) } : t
              )
            );
          }

          return {
            ...b,
            bookingStatus: 'CANCELLED',
            paymentStatus: b.paymentStatus === 'CAPTURED' ? 'REFUND_PENDING' : b.paymentStatus,
            cancellationReason: reason,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
  };

  const addReview = (
    trekId: string,
    rating: number,
    comment: string,
    reviewerName: string,
    reviewerId: string,
    reviewerAvatar?: string,
    trekTitle?: string,
    reviewerRole?: string
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      trekId,
      trekTitle: trekTitle || 'Sahyadri Expedition',
      reviewerId,
      reviewerName,
      reviewerAvatar: reviewerAvatar || '/Assets/boy.png',
      reviewerRole: reviewerRole || 'Verified Trekker',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const subscribeNewsletter = (email: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    const exists = newsletterSubscribers.some((s) => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: true, message: 'You are already subscribed with this email!' };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      status: 'SUBSCRIBED',
      subscribedAt: new Date().toISOString(),
    };
    setNewsletterSubscribers((prev) => [newSub, ...prev]);
    return { success: true, message: 'Thank you for subscribing to Make My Trek updates!' };
  };

  return (
    <DataContext.Provider
      value={{
        treks,
        approvedTreks,
        organizers,
        bookings,
        reviews,
        newsletterSubscribers,
        addTrek,
        updateTrek,
        approveTrek,
        rejectTrek,
        applyOrganizer,
        approveOrganizer,
        rejectOrganizer,
        createBooking,
        confirmBookingPayment,
        cancelBooking,
        addReview,
        deleteReview,
        subscribeNewsletter,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
