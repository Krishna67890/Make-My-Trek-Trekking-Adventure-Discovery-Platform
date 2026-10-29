export type UserRole = 'ADMIN' | 'ORGANIZER' | 'TREKKER' | 'USER';

export type AccountStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'SUSPENDED';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: AccountStatus;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced Mountaineer' | 'Certified Guide';
  city?: string;
  state?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  organizationName?: string;
  certifications?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerApplication {
  id: string;
  userId: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  experienceYears: number;
  certifications?: string;
  bio: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export type TrekDifficulty = 'Easy' | 'Easy - Moderate' | 'Moderate' | 'Challenging' | 'Difficult';

export type TrekStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ItineraryItem {
  day: number;
  title: string;
  details: string;
}

export interface TrekCoordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface Trek {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription: string;
  organizerId: string;
  organizerName: string;
  status: TrekStatus;
  location: string;
  address: string;
  coordinates: TrekCoordinates;
  duration: string; // e.g. "2-3 hrs", "1 Day", "2 Days"
  difficulty: TrekDifficulty;
  price: number;
  currency: string;
  capacity: number;
  bookedCount: number;
  availableDates: string[];
  images: string[];
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  routeCoordinates?: [number, number, number?][];
  featured?: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'REFUND_PENDING' | 'REFUNDED';
export type PaymentStatus = 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUND_PENDING' | 'REFUNDED';

export interface ParticipantInfo {
  name: string;
  age: number;
  gender?: string;
  emergencyContact?: string;
}

export interface Booking {
  id: string;
  trekId: string;
  trekTitle: string;
  trekkerId: string;
  trekkerName: string;
  trekkerEmail: string;
  trekkerPhone: string;
  organizerId: string;
  bookingDate: string;
  participants: ParticipantInfo[];
  totalAmount: number;
  currency: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  trekId: string;
  trekTitle?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerRole?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED';
  subscribedAt: string;
}
