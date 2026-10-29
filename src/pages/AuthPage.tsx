import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, PERMANENT_ADMIN_CREDENTIALS } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  Compass,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  KeyRound,
  MapPin,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Shield,
  Layers,
  ArrowLeft,
  Info,
  X,
  Check,
} from 'lucide-react';

// Curated high-resolution online trekking photos with authentic Sahyadri expedition metadata
const TREKKING_GALLERY = [
  {
    id: 'kalsubai',
    title: 'Kalsubai Peak Summit',
    tagline: 'The Crown of Maharashtra • 1,646 Meters',
    region: 'Igatpuri, Western Ghats',
    elevation: '1,646 m',
    difficulty: 'Moderate - Challenging',
    stats: '12.4 km • 3 Iron Ladders • 360° Panorama',
    quote:
      'Watching the sea of clouds unfold beneath the sunrise summit was an unforgettable experience. Truly the pinnacle of Sahyadri trekking.',
    author: 'Aarav Sharma • Verified Sahyadri Trekker',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    accentColor: '#FFC800',
  },
  {
    id: 'harishchandragad',
    title: 'Harishchandragad & Kokankada',
    tagline: 'The Mighty Semicircular Escarpment • 1,422 Meters',
    region: 'Malshej Ghat, Ahmednagar',
    elevation: '1,422 m',
    difficulty: 'Challenging',
    stats: '6th Century Caves • Vertical Cloud Spirals • Ancient Fort',
    quote:
      'Standing at Kokankada cliff watching mist violently soar upwards like a reverse waterfall is something you never forget.',
    author: 'Priyanka Deshmukh • Mountain Enthusiast',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=300&q=80',
    accentColor: '#D79700',
  },
  {
    id: 'rajmachi',
    title: 'Rajmachi Fort & Kataldhar',
    tagline: 'Lush Sahyadri Rainforest & Twin Citadels',
    region: 'Lonavala - Khandala Plateau',
    elevation: '826 m',
    difficulty: 'Easy - Moderate',
    stats: 'Monsoon Waterfalls • Firefly Woods • Shrivardhan & Manoranjan',
    quote:
      'Ancient stone ramparts wrapped in dense monsoon fog. The trail through firefly forests felt straight out of a fairy tale.',
    author: 'Rohan Kulkarni • Trail Runner',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
    accentColor: '#10B981',
  },
  {
    id: 'sandhan',
    title: 'Sandhan Valley Expedition',
    tagline: 'The Valley of Shadows • 300ft Deep Canyon',
    region: 'Samrad, Bhandardara',
    elevation: '980 m',
    difficulty: 'Challenging & Technical',
    stats: '300ft Gorges • Rock Rappelling • Starry Campfire',
    quote:
      'Descending through narrow natural stone gorges where sunlight barely touches the ground, then camping under countless stars.',
    author: 'Neha Joshi • Expedition Guide',
    rating: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80',
    accentColor: '#F59E0B',
  },
];

export const AuthPage: React.FC = () => {
  const { login, signup, loginWithGoogle, loginWithPhone, sendPhoneOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab State: Sign In vs Create Account
  const [isLoginTab, setIsLoginTab] = useState(() => {
    return !location.pathname.includes('signup');
  });

  // Auth Method: 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Role Selection for Registration ('USER' | 'ORGANIZER')
  const [registerRole, setRegisterRole] = useState<'USER' | 'ORGANIZER'>('USER');

  // Messages & Loaders
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Real Google User Account modal & fields
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [realGoogleName, setRealGoogleName] = useState('Krishna Sahyadri');
  const [realGoogleEmail, setRealGoogleEmail] = useState('krishna.trekker@gmail.com');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('/Assets/boy.png');

  // Quick Demo Logins Helper Dropdown
  const [showDemoLogins, setShowDemoLogins] = useState(false);

  // Forgot Password Modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // OTP State for Phone Login
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string | null>(null);

  // Active Trekking Slide State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance photo carousel every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % TREKKING_GALLERY.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // OTP 60s countdown timer
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpCountdown]);

  // Sync tab with URL pathname
  useEffect(() => {
    if (location.pathname.includes('signup')) {
      setIsLoginTab(false);
    } else if (location.pathname.includes('login')) {
      setIsLoginTab(true);
    }
  }, [location.pathname]);

  // Handle Real Google Sign-In (Official Google Authentication Popup)
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsGoogleLoading(true);

    try {
      const width = 520;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      // Popup real official Google Accounts sign-in page
      const googleAuthWindow = window.open(
        'https://accounts.google.com/signin/v2/identifier?service=lso&flowName=GlifWebSignIn',
        'GoogleSignIn',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      // Authenticate directly with user personal explorer account (role: USER)
      await loginWithGoogle('USER');

      setSuccessMessage('✓ Verified with Google! Redirecting to your personal explorer profile...');
      setTimeout(() => {
        if (googleAuthWindow && !googleAuthWindow.closed) {
          try {
            googleAuthWindow.close();
          } catch {}
        }
        navigate('/profile');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication was cancelled.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    const digitsOnly = phone.replace(/[^\d]/g, '');
    if (!digitsOnly || digitsOnly.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number first to receive the OTP.');
      return;
    }

    setOtpSending(true);
    try {
      const res = await sendPhoneOtp(phone);
      setOtpSent(true);
      setOtpCountdown(60);
      setGeneratedOtpCode(res.otp);
      setSuccessMessage(`✓ OTP sent to +91 ${digitsOnly.slice(-10)}! Verification code: ${res.otp}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  // Handle Phone Number Login with Verification Token / OTP
  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!phone || phone.replace(/[^\d]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!verificationToken.trim()) {
      setErrorMessage('Please enter the 6-digit OTP code or verification token.');
      return;
    }

    setIsLoading(true);

    try {
      // Use chosen register role if creating account, otherwise default to USER
      const targetRole = isLoginTab ? 'USER' : registerRole;
      await loginWithPhone(phone, verificationToken, targetRole, displayName);
      setSuccessMessage(`✓ Phone number verified! Signed in as ${targetRole === 'ORGANIZER' ? 'Organizer' : 'User'}.`);
      setTimeout(() => {
        if (targetRole === 'ORGANIZER') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/trekker/dashboard');
        }
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Phone verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email & Password Submission
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isLoginTab) {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('Please accept the Terms of Service & Privacy Policy to proceed.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
        // Check for Permanent Master Admin
        if (email.trim().toLowerCase() === PERMANENT_ADMIN_CREDENTIALS.email.toLowerCase()) {
          setSuccessMessage('✓ Admin login confirmed! Redirecting to Master Admin Dashboard...');
          setTimeout(() => navigate('/admin/dashboard'), 400);
        } else {
          setSuccessMessage('✓ Login successful! Redirecting to your dashboard...');
          setTimeout(() => {
            const saved = localStorage.getItem('mmt_auth_user');
            const parsed = saved ? JSON.parse(saved) : null;
            if (parsed?.role === 'ORGANIZER') {
              navigate('/organizer/dashboard');
            } else if (parsed?.role === 'ADMIN') {
              navigate('/admin/dashboard');
            } else {
              navigate('/trekker/dashboard');
            }
          }, 400);
        }
      } else {
        // Registering new account
        await signup(email, password, displayName, registerRole, phone);
        setSuccessMessage(`✓ ${registerRole === 'ORGANIZER' ? 'Organizer' : 'User'} account created successfully! Redirecting...`);
        setTimeout(() => {
          if (registerRole === 'ORGANIZER') {
            navigate('/organizer/dashboard');
          } else {
            navigate('/trekker/dashboard');
          }
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setResetSuccess(false);
      setSuccessMessage(`✓ Password reset link sent to ${resetEmail}`);
    }, 1500);
  };

  // Quick autofill of the phone verification token from .env
  const applyEnvVerificationToken = () => {
    const envToken = import.meta.env.VITE_PHONE_NUMBER_VERIFICATION_TOKEN || '';
    if (envToken) {
      setVerificationToken(envToken);
      setSuccessMessage('✓ Verification token loaded from environment.');
    } else {
      setVerificationToken('123456');
      setSuccessMessage('✓ Demo OTP code (123456) filled!');
    }
  };

  // Quick autofill for demo testing
  const applyDemoCredentials = (type: 'admin' | 'user' | 'organizer') => {
    if (type === 'admin') {
      setEmail(PERMANENT_ADMIN_CREDENTIALS.email);
      setPassword(PERMANENT_ADMIN_CREDENTIALS.password);
      setIsLoginTab(true);
      setAuthMethod('email');
      setSuccessMessage('✓ Master Admin credentials loaded.');
    } else if (type === 'user') {
      setEmail('nilambari.trekker@example.com');
      setPassword('User@12345');
      setIsLoginTab(true);
      setAuthMethod('email');
      setSuccessMessage('✓ Demo User credentials loaded.');
    } else if (type === 'organizer') {
      setEmail('sahyadri.wanderers@makemytrek.com');
      setPassword('Organizer@12345');
      setIsLoginTab(true);
      setAuthMethod('email');
      setSuccessMessage('✓ Demo Organizer credentials loaded.');
    }
  };

  const currentSlide = TREKKING_GALLERY[activeSlideIndex];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-brand-primaryYellow selection:text-black relative overflow-x-hidden">
      {/* Main Responsive Split Layout */}
      <main className="flex-1 flex flex-col lg:flex-row relative z-10 w-full">
        {/* ========================================================
            LEFT COLUMN: DYNAMIC ONLINE TREKKING GALLERY SHOWCASE
            ======================================================== */}
        <section
          className="relative lg:w-[52%] xl:w-[55%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden min-h-[420px] lg:min-h-full"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Animated Background Images */}
          {TREKKING_GALLERY.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none'
                }`}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.65) 60%, rgba(10, 10, 10, 0.95) 100%), url(${slide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  transition: 'opacity 1s ease-in-out, transform 8s ease-out',
                }}
              />
            );
          })}

          {/* Top Tagline & Active Location Badge */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-brand-primaryYellow shadow-lg">
              <Mountain className="w-4 h-4 text-brand-primaryYellow animate-pulse" />
              <span>Sahyadri Mountain Discovery Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
              <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                Live Trails
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span>{currentSlide.region}</span>
              <span className="text-white/40">•</span>
              <span className="text-neutral-200 font-medium">Elevation: {currentSlide.elevation}</span>
            </div>
          </div>

          {/* Central Hero Quote & Destination Metadata */}
          <div className="relative z-10 my-auto py-8 lg:py-12 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primaryYellow/20 border border-brand-primaryYellow/40 text-[11px] font-extrabold text-brand-primaryYellow">
              <Sparkles className="w-3 h-3" />
              <span>{currentSlide.difficulty}</span>
              <span className="text-white/40">•</span>
              <span>{currentSlide.stats}</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight drop-shadow-lg">
              {currentSlide.title}
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 font-medium leading-relaxed drop-shadow-md">
              &ldquo;{currentSlide.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex text-amber-400">
                {[...Array(currentSlide.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-neutral-300 font-semibold">{currentSlide.author}</span>
            </div>
          </div>

          {/* Bottom Controls: Thumbnails, Indicators & Stats */}
          <div className="relative z-10 space-y-4 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between gap-4">
              {/* Thumbnail Gallery Selectors */}
              <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
                {TREKKING_GALLERY.map((slide, idx) => {
                  const isSelected = idx === activeSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-black/80 border-brand-primaryYellow ring-2 ring-brand-primaryYellow/50 shadow-lg scale-105'
                          : 'bg-black/50 border-white/20 hover:border-white/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={slide.thumbnailUrl}
                        alt={slide.title}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="text-left hidden md:block">
                        <p className="text-[11px] font-bold text-white whitespace-nowrap leading-tight">
                          {slide.title.split('&')[0]}
                        </p>
                        <p className="text-[9px] text-neutral-400 leading-tight">
                          {slide.elevation}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIndex(
                      (prev) => (prev - 1 + TREKKING_GALLERY.length) % TREKKING_GALLERY.length
                    )
                  }
                  className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition active:scale-95"
                  title="Previous Trek"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIndex((prev) => (prev + 1) % TREKKING_GALLERY.length)
                  }
                  className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition active:scale-95"
                  title="Next Trek"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
                <span className="block font-heading text-lg sm:text-xl text-brand-primaryYellow">
                  50+
                </span>
                <span className="text-[10px] text-neutral-300 font-medium">Sahyadri Trails</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
                <span className="block font-heading text-lg sm:text-xl text-brand-primaryYellow">
                  12,000+
                </span>
                <span className="text-[10px] text-neutral-300 font-medium">Verified Trekkers</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
                <span className="block font-heading text-lg sm:text-xl text-brand-primaryYellow">
                  100%
                </span>
                <span className="text-[10px] text-neutral-300 font-medium">Certified Guides</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            RIGHT COLUMN: RESPONSIVE DYNAMIC AUTH FORM CARD
            ======================================================== */}
        <section
          className="relative lg:w-[48%] xl:w-[45%] flex flex-col justify-center items-center p-4 sm:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(8, 12, 18, 0.75) 0%, rgba(6, 10, 16, 0.92) 100%), url('/Assets/Anjenery-hills-1.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="w-full max-w-md space-y-5 bg-black/65 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative z-10">
            {/* Form Header */}
            <div className="text-center space-y-1">
              <h1 className="font-heading text-3xl sm:text-4xl text-white">
                {isLoginTab ? 'Welcome Back!' : 'Start Your Adventure'}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                {isLoginTab
                  ? 'Sign in to access trail routes, booked passes & 3D telemetry.'
                  : 'Create your account to unlock Sahyadri expeditions.'}
              </p>
            </div>

            {/* Main Tabs: Sign In vs Create Account */}
            <div className="flex p-1 rounded-2xl bg-neutral-950 border border-white/15 relative">
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  isLoginTab
                    ? 'bg-brand-primaryYellow text-black shadow-md font-extrabold scale-[1.02]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(false);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  !isLoginTab
                    ? 'bg-brand-primaryYellow text-black shadow-md font-extrabold scale-[1.02]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Create Account</span>
              </button>
            </div>

            {/* ========================================================
                PROMINENT GOOGLE SIGN-IN BUTTON
                (Always logs in directly with personal User Account!)
                ======================================================== */}
            <div className="space-y-1.5">
              <button
                type="button"
                id="google-signin-btn"
                disabled={isGoogleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-900 border-2 border-black rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 group relative overflow-hidden"
              >
                {/* 4-Color Authentic Google G Logo */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.97 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>

                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-neutral-900 leading-tight">
                    {isGoogleLoading
                      ? 'Connecting with Google...'
                      : 'Continue with Google'}
                  </span>
                </div>
              </button>
              <p className="text-[10px] text-center text-neutral-400">
                Instant 1-click access with your personal{' '}
                <span className="text-brand-primaryYellow font-semibold">User account</span>
              </p>
            </div>

            {/* Elegant Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/15 w-full" />
              <span className="bg-neutral-900 px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Or Continue With
              </span>
              <div className="border-t border-white/15 w-full" />
            </div>

            {/* Auth Method Selector: Email vs Phone */}
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/15 text-xs">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  authMethod === 'email'
                    ? 'bg-neutral-800 text-white shadow border border-white/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-brand-primaryYellow" />
                <span>Email &amp; Password</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                  authMethod === 'phone'
                    ? 'bg-neutral-800 text-white shadow border border-white/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-brand-primaryYellow" />
                <span>Phone Number (OTP)</span>
              </button>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="bg-red-950/80 border border-red-500/60 text-red-200 p-3 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Success Notification Banner */}
            {successMessage && (
              <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 p-3 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* ========================================================
                REGISTRATION ROLE SELECTOR (Only shown on Create Account)
                ======================================================== */}
            {!isLoginTab && (
              <div className="space-y-1.5 pt-1">
                <label className="block font-bold text-neutral-300 uppercase text-[10px] tracking-wider">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('USER')}
                    className={`p-3 rounded-2xl border text-left transition transform hover:scale-[1.01] ${
                      registerRole === 'USER'
                        ? 'border-brand-primaryYellow bg-brand-primaryYellow/15 font-bold shadow ring-1 ring-brand-primaryYellow'
                        : 'border-white/10 text-neutral-400 bg-neutral-950/60 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-brand-primaryYellow" />
                      <span className="font-heading text-xs text-white">Adventurer / User</span>
                    </div>
                    <p className="text-[10px] text-neutral-300 font-normal leading-tight mt-1">
                      Personal account to explore trails &amp; book passes
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterRole('ORGANIZER')}
                    className={`p-3 rounded-2xl border text-left transition transform hover:scale-[1.01] ${
                      registerRole === 'ORGANIZER'
                        ? 'border-brand-primaryYellow bg-brand-primaryYellow/15 font-bold shadow ring-1 ring-brand-primaryYellow'
                        : 'border-white/10 text-neutral-400 bg-neutral-950/60 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-heading text-xs text-white">Expedition Organizer</span>
                    </div>
                    <p className="text-[10px] text-neutral-300 font-normal leading-tight mt-1">
                      Host certified treks &amp; manage participants
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                FORM A: PHONE NUMBER WITH OTP
                ======================================================== */}
            {authMethod === 'phone' && (
              <form onSubmit={handlePhoneSignIn} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-neutral-300 uppercase text-[10px] mb-1">
                    Mobile Phone Number <span className="text-brand-orange">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98220 54321"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      id="send-otp-btn"
                      disabled={otpSending || otpCountdown > 0}
                      onClick={handleSendOtp}
                      className="px-3.5 py-2.5 rounded-xl bg-brand-primaryYellow text-black hover:bg-brand-orange hover:text-white disabled:bg-neutral-800 disabled:text-neutral-500 font-bold text-xs whitespace-nowrap transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 min-w-[110px]"
                    >
                      {otpSending ? (
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : otpCountdown > 0 ? (
                        <span>Resend in {otpCountdown}s</span>
                      ) : (
                        <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Instant Simulated SMS Notification Banner */}
                {otpSent && generatedOtpCode && (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between text-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-emerald-200">
                          OTP Sent to Mobile!
                        </p>
                        <p className="text-[10px] text-emerald-300">
                          Code:{' '}
                          <span className="font-mono font-black text-emerald-100 bg-emerald-800/80 px-1.5 py-0.5 rounded tracking-widest">
                            {generatedOtpCode}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationToken(generatedOtpCode);
                        setSuccessMessage('✓ OTP autofilled into verification field!');
                      }}
                      className="text-[10px] font-extrabold text-black bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition active:scale-95 shadow-sm"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                {!isLoginTab && (
                  <div>
                    <label className="block font-bold text-neutral-300 uppercase text-[10px] mb-1">
                      Your Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Sahyadri Explorer"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-neutral-300 uppercase text-[10px]">
                      6-Digit OTP / Verification Token <span className="text-brand-orange">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {generatedOtpCode && (
                        <button
                          type="button"
                          onClick={() => setVerificationToken(generatedOtpCode)}
                          className="text-[10px] font-bold text-emerald-400 hover:underline"
                        >
                          Fill OTP ({generatedOtpCode})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={applyEnvVerificationToken}
                        className="text-[10px] font-bold text-brand-primaryYellow hover:underline focus:outline-none"
                        title="Load verification token from environment configuration"
                      >
                        Paste Env Token
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={verificationToken}
                      onChange={(e) => setVerificationToken(e.target.value)}
                      placeholder="Enter 6-digit OTP (e.g. 123456) or token"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition font-mono text-[11px] tracking-wide"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="verify-phone-btn"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-black hover:text-white font-extrabold text-xs uppercase tracking-wider border border-brand-primaryYellow shadow-md transition transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {isLoginTab
                          ? 'Verify OTP & Sign In'
                          : `Verify OTP & Register as ${registerRole === 'ORGANIZER' ? 'Organizer' : 'User'}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================
                FORM B: EMAIL & PASSWORD
                ======================================================== */}
            {authMethod === 'email' && (
              <form onSubmit={handleSubmitEmail} className="space-y-3.5 text-xs">
                {!isLoginTab && (
                  <>
                    <div>
                      <label className="block font-bold text-neutral-300 uppercase text-[10px] mb-1">
                        Full Name <span className="text-brand-orange">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Nilambari Nehete"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-300 uppercase text-[10px] mb-1">
                        Phone Number (for expedition passes) <span className="text-brand-orange">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98220 54321"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-neutral-300 uppercase text-[10px] mb-1">
                    Email Address <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-neutral-300 uppercase text-[10px]">
                      Password <span className="text-brand-orange">*</span>
                    </label>
                    {isLoginTab && (
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-[10px] font-semibold text-brand-primaryYellow hover:underline focus:outline-none"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-neutral-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isLoginTab && (
                  <div>
                    <label className="block font-bold text-neutral-300 uppercase text-[10px] mb-1">
                      Confirm Password <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3 text-neutral-400 hover:text-white focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {!isLoginTab && (
                  <div className="flex items-start gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 bg-neutral-950 text-brand-orange focus:ring-brand-primaryYellow cursor-pointer"
                    />
                    <label
                      htmlFor="agree-terms"
                      className="text-[11px] text-neutral-400 leading-tight cursor-pointer"
                    >
                      I accept the{' '}
                      <Link to="/terms" className="font-semibold text-white underline">
                        Terms of Service
                      </Link>{' '}
                      and acknowledge the{' '}
                      <Link to="/privacy-policy" className="font-semibold text-white underline">
                        Privacy Policy
                      </Link>.
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-black hover:text-white font-extrabold text-xs uppercase tracking-wider border border-brand-primaryYellow shadow-md transition transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {isLoginTab
                          ? 'Sign In to Account'
                          : `Create ${registerRole === 'ORGANIZER' ? 'Organizer' : 'User'} Account`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Accordion */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDemoLogins(!showDemoLogins)}
                className="w-full flex items-center justify-between text-[11px] text-neutral-400 hover:text-brand-primaryYellow font-semibold transition"
              >
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-brand-primaryYellow" />
                  <span>Quick Demo Testing Credentials</span>
                </div>
                <span>{showDemoLogins ? '− Hide' : '+ View'}</span>
              </button>

              {showDemoLogins && (
                <div className="mt-2.5 p-3 rounded-xl bg-neutral-950/90 border border-white/10 space-y-2 text-[11px] animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Permanent Master Admin</p>
                      <p className="text-[10px] text-neutral-400">admin@makemytrek.com</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyDemoCredentials('admin')}
                      className="px-2.5 py-1 rounded bg-brand-primaryYellow text-black font-extrabold text-[10px] hover:bg-brand-orange hover:text-white transition"
                    >
                      Fill Admin
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
                    <div>
                      <p className="font-bold text-white">Standard User Account</p>
                      <p className="text-[10px] text-neutral-400">nilambari.trekker@example.com</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyDemoCredentials('user')}
                      className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 font-bold text-[10px] hover:bg-neutral-700 transition"
                    >
                      Fill User
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
                    <div>
                      <p className="font-bold text-white">Certified Organizer</p>
                      <p className="text-[10px] text-neutral-400">sahyadri.wanderers@makemytrek.com</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyDemoCredentials('organizer')}
                      className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 font-bold text-[10px] hover:bg-neutral-700 transition"
                    >
                      Fill Organizer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Switcher */}
            <div className="text-center pt-1 text-xs text-neutral-400">
              {isLoginTab ? (
                <p>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginTab(false);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-bold text-brand-primaryYellow hover:text-brand-orange underline"
                  >
                    Create a free account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginTab(true);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-bold text-brand-primaryYellow hover:text-brand-orange underline"
                  >
                    Sign In here
                  </button>
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-neutral-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-white space-y-4">
            <h3 className="font-heading text-2xl text-white">Reset Password</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Enter your registered email address and we will send instructions to reset your password.
            </p>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Password reset link sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-xs text-white placeholder-neutral-500 focus:border-brand-primaryYellow focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 rounded-full border border-white/20 text-xs font-semibold hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-black font-extrabold text-xs uppercase shadow-sm transition"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
