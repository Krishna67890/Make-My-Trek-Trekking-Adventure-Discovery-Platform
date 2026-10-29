import { Trek, OrganizerApplication, Review, Booking, UserProfile } from '../types';

export const INITIAL_TREKS: Trek[] = [
  {
    id: 'trek-anjeneri-hills',
    slug: 'anjeneri-hills-nashik',
    title: 'Anjaneri Hills',
    subtitle: 'Birthplace of Lord Hanuman & Scenic Plateau Lake',
    description: `Anjaneri Hills is located in the Trimbakeshwar range, approximately 20 km from Nashik, Maharashtra. Standing at an elevation of 1,280 meters (4,200 ft), Anjaneri is revered as the birthplace of Lord Hanuman. The trek features a picturesque lake atop the plateau (shaped like a footprint), historic Jain caves, dense foliage during the post-monsoon season, and panoramic views of the Western Ghats including Brahmagiri. The trail ascends through stone steps, ancient gateways, and grassy plateaus.`,
    shortDescription: 'Trek to the birthplace of Lord Hanuman, featuring an iconic footprint lake, ancient caves, and sweeping Sahyadri views.',
    organizerId: 'org-sahyadri-explorers',
    organizerName: 'Sahyadri Explorers Guild',
    status: 'APPROVED',
    location: 'Nashik, Maharashtra',
    address: 'Anjaneri Fort, Nasik Trimbakeshwar Road, Anjneri, Nashik - 422213',
    coordinates: {
      lat: 19.9238,
      lng: 73.5786,
      altitude: 1280,
    },
    duration: '2-3 hrs',
    difficulty: 'Easy - Moderate',
    price: 850,
    currency: 'INR',
    capacity: 35,
    bookedCount: 14,
    availableDates: ['2026-11-08', '2026-11-15', '2026-11-22', '2026-11-29', '2026-12-06'],
    images: [
      '/Assets/Anjenery-hills-1.png',
      '/Assets/3.png',
      '/Assets/Anjeneri-Hills-map-1.png',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Base Village Gathering & Briefing',
        details: 'Meet the certified trek leader at Anjaneri base village parking area at 06:30 AM. Equipment check, hydration briefing, and warm-up routine.'
      },
      {
        day: 1,
        title: 'Ascent via Historic Stone Carvings',
        details: 'Ascend through the first plateau passing 12th-century Jain rock-cut caves and sculpted pillars. Short break at the midpoint water cistern.'
      },
      {
        day: 1,
        title: 'Footprint Lake & Temple Summit',
        details: 'Arrive at the expansive upper plateau and the natural lake shaped like a divine footprint. Visit the Anjani Mata and Hanuman temples at the summit (1,280m).'
      },
      {
        day: 1,
        title: 'Descent & Traditional Local Lunch',
        details: 'Begin descent by 11:30 AM. Savor warm organic Maharashtrian Pitla Bhakri lunch at the base village before departures.'
      }
    ],
    inclusions: [
      'Certified Wilderness First Responder (WFR) Trek Leader',
      'Entry fees and forest department permits',
      'Traditional vegetarian breakfast & village lunch',
      'First aid kit & oxygen monitoring',
      'Trek route GPS tracking and guidance'
    ],
    exclusions: [
      'Personal transport to Anjaneri base village',
      'Personal trekking gear (shoes, daypack)',
      'Packaged drinking water bottles',
      'Personal insurance'
    ],
    routeCoordinates: [
      [73.5712, 19.9315, 680],  // Base village
      [73.5735, 19.9280, 840],  // Cave trail
      [73.5758, 19.9255, 1020], // Mid-plateau
      [73.5780, 19.9242, 1220], // Footprint lake
      [73.5786, 19.9238, 1280], // Anjaneri Summit temple
    ],
    featured: true,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'trek-kalsubai-peak',
    slug: 'kalsubai-highest-peak-maharashtra',
    title: 'Kalsubai Peak',
    subtitle: 'Everest of Maharashtra (1,646 m / 5,400 ft)',
    description: 'Conquer the highest peak in Maharashtra. Known for iron ladders affixed to vertical rock faces, magnificent sunrise viewpoints over Bhandardara backwaters, and a rich biodiversity trail.',
    shortDescription: 'Conquer the highest peak in Maharashtra with iron ladders, mesmerizing sunrise views, and expert guidance.',
    organizerId: 'org-sahyadri-explorers',
    organizerName: 'Sahyadri Explorers Guild',
    status: 'APPROVED',
    location: 'Bari Village, Igatpuri',
    address: 'Bari Village, Akole Taluka, Ahmednagar / Igatpuri border - 422604',
    coordinates: {
      lat: 19.6012,
      lng: 73.7107,
      altitude: 1646,
    },
    duration: '4-5 hrs',
    difficulty: 'Moderate',
    price: 1199,
    currency: 'INR',
    capacity: 40,
    bookedCount: 22,
    availableDates: ['2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28'],
    images: [
      '/Assets/Anjenery-hills-1.png',
      '/Assets/Mountains-1.png',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Midnight Base Camp Rendezvous',
        details: 'Meet at Bari village at 02:30 AM for a night-trek briefing and headlamp checks.'
      },
      {
        day: 1,
        title: 'Ladder Ascents & Summit Sunrise',
        details: 'Climb 4 steep steel ladders under the starlight to reach the Kalsubai Devi shrine for a 360-degree golden hour sunrise.'
      }
    ],
    inclusions: [
      'Experienced trek leaders & safety sweepers',
      'Local homestay breakfast & tea',
      'Forest department permit pass',
      'First aid & emergency support'
    ],
    exclusions: ['Travel to Bari village', 'Personal snacks'],
    featured: true,
    createdAt: '2026-10-05T10:00:00.000Z',
    updatedAt: '2026-10-21T10:00:00.000Z',
  },
  {
    id: 'trek-harishchandragad-konkan-kada',
    slug: 'harishchandragad-konkan-kada',
    title: 'Harishchandragad',
    subtitle: 'Epic Konkan Kada Cliff & Ancient Kedareshwar Cave',
    description: 'Famous for the awe-inspiring semicircular Konkan Kada cliff with a sheer drop of over 1,000 meters. Explore ancient Hemadpanthi temples and the mystical water-filled Kedareshwar cave.',
    shortDescription: 'Witness the breathtaking circular Konkan Kada cliff, mystical rock-cut water cave, and panoramic clouds.',
    organizerId: 'org-trek-trails',
    organizerName: 'Highland Trail Adventures',
    status: 'APPROVED',
    location: 'Khireshwar / Pachnai',
    address: 'Khireshwar Base, Ahmednagar District, Maharashtra - 412409',
    coordinates: {
      lat: 19.3878,
      lng: 73.7781,
      altitude: 1424,
    },
    duration: '1-2 Days',
    difficulty: 'Challenging',
    price: 1650,
    currency: 'INR',
    capacity: 25,
    bookedCount: 18,
    availableDates: ['2026-11-08', '2026-11-22', '2026-12-05'],
    images: [
      '/Assets/Anjenery-hills-1.png',
      '/Assets/3.png',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Trek from Pachnai to Temple Caves',
        details: 'Climb the forested trail from Pachnai base to Harishchandreshwar temple complex. Sunset viewing at Konkan Kada.'
      },
      {
        day: 2,
        title: 'Taramati Peak Sunrise & Descent',
        details: 'Dawn hike to Taramati peak (2nd highest peak). Exploration of Kedareshwar cave followed by descent.'
      }
    ],
    inclusions: [
      'Tent camping or cave shelter with sleeping mats',
      '2 meals & 2 breakfasts prepared by local villagers',
      'Safety harness & professional trek leaders'
    ],
    exclusions: ['Sleeping bags', 'Personal porterage'],
    featured: true,
    createdAt: '2026-10-10T10:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z',
  },
  {
    id: 'trek-sandhan-valley-canyon',
    slug: 'sandhan-valley-canyon-trek',
    title: 'Sandhan Valley',
    subtitle: 'The Grand Canyon of Maharashtra with Rappelling',
    description: 'A 200-ft deep naturally carved water valley surrounded by giant rock walls. Includes descending through boulder paths, waist-deep natural pools, and rappelling.',
    shortDescription: 'The Grand Canyon of Maharashtra featuring rock chimneys, water pools, and thrilling rappelling descents.',
    organizerId: 'org-trek-trails',
    organizerName: 'Highland Trail Adventures',
    status: 'APPROVED',
    location: 'Samrad, Bhandardara',
    address: 'Samrad Base Village, Bhandardara Region - 422604',
    coordinates: {
      lat: 19.5312,
      lng: 73.6934,
      altitude: 950,
    },
    duration: '1 Day',
    difficulty: 'Challenging',
    price: 1899,
    currency: 'INR',
    capacity: 20,
    bookedCount: 12,
    availableDates: ['2026-11-15', '2026-11-29', '2026-12-13'],
    images: [
      '/Assets/Anjenery-hills-1.png',
      '/Assets/Mountains-1.png',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Canyon Entry & Boulder Scramble',
        details: 'Enter the shaded valley at 07:00 AM. Scramble over massive volcanic boulders and wade through refreshing natural rock pools.'
      },
      {
        day: 1,
        title: '120ft Rappelling & Base Exit',
        details: 'Rappel down using UIAA certified equipment with twin backup ropes under certified mountaineering instructors.'
      }
    ],
    inclusions: [
      'Technical rappelling gear (harness, helmet, descender)',
      'Certified mountaineering instructor supervision',
      'Village lunch & snacks'
    ],
    exclusions: ['Travel to Samrad', 'Water shoes'],
    featured: false,
    createdAt: '2026-10-12T10:00:00.000Z',
    updatedAt: '2026-10-23T10:00:00.000Z',
  }
];

export const INITIAL_ORGANIZERS: OrganizerApplication[] = [
  {
    id: 'app-1',
    userId: 'user-org-1',
    organizationName: 'Sahyadri Explorers Guild',
    contactPerson: 'Sandeep Varma',
    email: 'sandeep@sahyadriexplorers.com',
    phone: '+91 98234 11223',
    experienceYears: 7,
    certifications: 'BMC (Basic Mountaineering Course - NIM Uttarkashi), Wilderness First Responder',
    bio: 'Pioneering safe, eco-conscious Sahyadri trekking since 2017 with over 450 successful expeditions in Maharashtra.',
    status: 'APPROVED',
    submittedAt: '2026-09-15T09:00:00.000Z',
    reviewedAt: '2026-09-16T11:00:00.000Z',
  },
  {
    id: 'app-2',
    userId: 'user-org-2',
    organizationName: 'Highland Trail Adventures',
    contactPerson: 'Pooja Kulkarni',
    email: 'pooja@highlandtrails.in',
    phone: '+91 94239 88776',
    experienceYears: 5,
    certifications: 'Advanced Mountaineering Course (HMI Darjeeling)',
    bio: 'Specialized in technical canyon descents, rock climbing, and high-altitude Western Ghats backpacking.',
    status: 'APPROVED',
    submittedAt: '2026-09-20T14:30:00.000Z',
    reviewedAt: '2026-09-21T10:15:00.000Z',
  },
  {
    id: 'app-3',
    userId: 'user-org-3',
    organizationName: 'Western Ghats Odyssey',
    contactPerson: 'Mahesh Jadhav',
    email: 'mahesh@ghatsodyssey.org',
    phone: '+91 98901 44556',
    experienceYears: 3,
    certifications: 'Red Cross First Aid Certified Guide',
    bio: 'Local Nashik trekking club with focus on Anjaneri, Brahmagiri, and Ramshej historical forts.',
    status: 'PENDING',
    submittedAt: '2026-10-25T16:00:00.000Z',
  }
];

// Real authenticated reviews list (User generated)
export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'MMT-BK-88412',
    trekId: 'trek-anjeneri-hills',
    trekTitle: 'Anjaneri Hills',
    trekkerId: 'demo-trekker-uid',
    trekkerName: 'Nilambari Nehete',
    trekkerEmail: 'nilambari.trekker@example.com',
    trekkerPhone: '+91 98220 54321',
    organizerId: 'org-sahyadri-explorers',
    bookingDate: '2026-11-15',
    participants: [
      { name: 'Nilambari Nehete', age: 26, gender: 'Female' },
      { name: 'Aarav Nehete', age: 29, gender: 'Male' }
    ],
    totalAmount: 1700,
    currency: 'INR',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'CAPTURED',
    razorpayOrderId: 'order_test_9921',
    razorpayPaymentId: 'pay_test_8871',
    createdAt: '2026-10-27T11:30:00.000Z',
    updatedAt: '2026-10-27T11:32:00.000Z',
  }
];

export const DEMO_USERS: Record<string, UserProfile> = {
  admin: {
    uid: 'demo-admin-uid',
    email: 'admin@makemytrek.com',
    displayName: 'Admin Master',
    role: 'ADMIN',
    status: 'ACTIVE',
    phone: '+91 99000 11222',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-10-28T00:00:00.000Z',
  },
  organizer: {
    uid: 'demo-organizer-uid',
    email: 'organizer@sahyadriexplorers.com',
    displayName: 'Sandeep Varma (Organizer)',
    role: 'ORGANIZER',
    status: 'ACTIVE',
    phone: '+91 98234 11223',
    createdAt: '2026-09-15T09:00:00.000Z',
    updatedAt: '2026-10-28T00:00:00.000Z',
  },
  trekker: {
    uid: 'demo-trekker-uid',
    email: 'nilambari.trekker@example.com',
    displayName: 'Nilambari Nehete',
    role: 'TREKKER',
    status: 'ACTIVE',
    phone: '+91 98220 54321',
    createdAt: '2026-10-15T00:00:00.000Z',
    updatedAt: '2026-10-28T00:00:00.000Z',
  }
};
