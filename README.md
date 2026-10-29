# Make-My-Trek-Trekking-Adventure-Discovery-Platform

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Verified%20Payments-0C2340?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com/)

**Make My Trek** is a modern, high-performance web platform for discovering trekking adventures, exploring 3D interactive terrain and global globe trails, calculating dynamic GPS travel routes & distance-based pricing, and booking certified trekking expeditions with integrated Razorpay payments.

---

## 🚀 Key Features

### 🌍 1. 3D Earth Globe & GPS Navigation
- **Interactive WebGL Earth Globe** with high-resolution textures, atmospheric glow, and cloud layers.
- **Great-Circle Curved GPS Routes**: Visualized 3D arcs connecting user departure locations (Live GPS, Nashik, Mumbai, Pune, Delhi, Bengaluru) to mountain peak destinations with animated traveling photon particles.
- **Dynamic Distance-Based Fare Calculation**:
  - Trail distance and GPS transit distance calculated using Haversine geodesic mathematics.
  - Automatic pricing tiering: Local Hike (< 15 km), Regional Transit (15–50 km), Highway Express Transit (50–250 km), and Inter-State Transit (> 250 km).
- **Deep Zoom & Regional Quick-Navigation**:
  - Expanded zoom limits allowing inspection of regional mountain ranges up close.
  - Shortcut pills for **Sahyadri**, **Himalayas**, **South India**, and **World**.
  - Catalog of 16+ curated peaks (Anjaneri, Kalsubai, Harishchandragad, Rajgad, Torna, Sinhagad, AMK, Kudremukh, Everest, Annapurna, Ladakh, etc.).

### 🗺️ 2. Actual Local Trail Map
- **OpenStreetMap & Leaflet Integration**: High-clarity regional maps with GPS location tracking.
- Interactive trail polylines, departure hub pickers, driving time estimates, and direct booking.

### 🔐 3. Authentication & Role Management
- **Role Categories**:
  - **Trekker**: Discover trails, track routes, and book expeditions.
  - **Organizer**: Create certified expeditions, manage trekker rosters, and handle bookings.
  - **Admin**: Master administrative portal with permanent credentials.
- **Phone Number Login with Working "Send OTP" Button**:
  - 6-digit OTP generation with 60-second cooldown timer.
  - 1-click Auto-Fill helper for instant verification.
  - Supports environment trial token (`VITE_PHONE_NUMBER_VERIFICATION_TOKEN`).
- **Google Sign-In via Firebase**:
  - Safe configuration with fallback handling for demo keys and full Firestore user profiling.

### 💳 4. Verified Expedition Booking with Razorpay
- Direct **"Book with Razorpay"** flow from Globe HUD and Local Map.
- Automatic pre-fill of departure origin, destination, calculated travel distance, and dynamic fare.
- Itemized price breakdown with verified booking receipt tickets.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, Lucide Icons, Canvas 2D/WebGL
- **Maps & 3D**: Three.js / WebGL, Leaflet, OpenStreetMap
- **Authentication & Database**: Firebase Auth, Cloud Firestore
- **Payments**: Razorpay Checkout API

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Krishna67890/Make-My-Trek-Trekking-Adventure-Discovery-Platform.git
cd Make-My-Trek-Trekking-Adventure-Discovery-Platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=make-my-trek.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=make-my-trek
VITE_FIREBASE_STORAGE_BUCKET=make-my-trek.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Razorpay Test Key
VITE_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag

# Phone Verification Token
VITE_PHONE_NUMBER_VERIFICATION_TOKEN=your_token_here

# Backend API
VITE_API_URL=http://localhost:5000
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
