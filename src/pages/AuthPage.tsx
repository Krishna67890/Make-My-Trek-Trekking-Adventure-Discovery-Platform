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
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, signup, loginWithGoogle, loginWithPhone, sendPhoneOtp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Role Selection (Trekker vs Organizer only)
  const [roleSelection, setRoleSelection] = useState<'TREKKER' | 'ORGANIZER'>('TREKKER');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // OTP State for Phone Login
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string | null>(null);

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
      setSuccessMessage(`✓ OTP sent to ${phone}! Verification code: ${res.otp}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes('signup')) {
      setIsLoginTab(false);
    } else if (location.pathname.includes('login')) {
      setIsLoginTab(true);
    }
  }, [location.pathname]);

  // Handle Google Login via Firebase
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle(roleSelection);
      setSuccessMessage(`Google Authentication successful as ${roleSelection}! Redirecting...`);
      setTimeout(() => {
        if (roleSelection === 'ORGANIZER') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/trekker/dashboard');
        }
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Phone Number Login with Verification Token
  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!phone || phone.replace(/[^\d]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!verificationToken.trim()) {
      setErrorMessage('Please enter the Phone Verification Token.');
      return;
    }

    setIsLoading(true);

    try {
      await loginWithPhone(phone, verificationToken, roleSelection, displayName);
      setSuccessMessage(`Phone Number verified successfully! Logged in as ${roleSelection}.`);
      setTimeout(() => {
        if (roleSelection === 'ORGANIZER') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/trekker/dashboard');
        }
      }, 600);
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
      if (!agreeTerms) {
        setErrorMessage('Please accept the Terms of Service & Privacy Policy to proceed.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
        // Route according to user role
        if (email.trim().toLowerCase() === PERMANENT_ADMIN_CREDENTIALS.email.toLowerCase()) {
          setSuccessMessage('Admin login confirmed! Redirecting to Master Admin Dashboard...');
          setTimeout(() => navigate('/admin/dashboard'), 400);
        } else {
          setSuccessMessage('Login successful! Redirecting to your dashboard...');
          setTimeout(() => {
            const saved = localStorage.getItem('mmt_auth_user');
            const parsed = saved ? JSON.parse(saved) : null;
            if (parsed?.role === 'ORGANIZER') {
              navigate('/organizer/dashboard');
            } else {
              navigate('/trekker/dashboard');
            }
          }, 400);
        }
      } else {
        await signup(email, password, displayName, roleSelection, phone);
        setSuccessMessage(`${roleSelection === 'ORGANIZER' ? 'Organizer' : 'Trekker'} account created successfully! Redirecting...`);
        setTimeout(() => {
          if (roleSelection === 'ORGANIZER') {
            navigate('/organizer/dashboard');
          } else {
            navigate('/trekker/dashboard');
          }
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setResetSuccess(false);
      setSuccessMessage(`Password reset link sent to ${resetEmail}`);
    }, 1800);
  };

  // Quick autofill of the phone verification token from .env
  const applyEnvVerificationToken = () => {
    const envToken = import.meta.env.VITE_PHONE_NUMBER_VERIFICATION_TOKEN || '';
    if (envToken) {
      setVerificationToken(envToken);
      setSuccessMessage('Verification token loaded from environment.');
    }
  };

  return (
    <div className="min-h-screen bg-mountain-auth flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-block focus:outline-none">
          <img
            src="/Assets/MMT-Web-logo.png"
            alt="Make My Trek Logo"
            className="mx-auto h-14 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform"
          />
        </Link>
        <h1 className="font-heading text-4xl sm:text-5xl text-white mt-3 drop-shadow-md">
          Make My Trek
        </h1>
        <p className="font-body text-xs sm:text-sm text-neutral-200 mt-1 drop-shadow-sm font-medium">
          {isLoginTab
            ? 'Sign in to access your trekking account, route navigation & bookings.'
            : 'Select your account type to register on Make My Trek.'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-md border-3 border-black rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-4">
          {/* Toggle Tabs: Sign In / Create Account */}
          <div className="flex rounded-full bg-neutral-100 p-1 border-2 border-black">
            <button
              onClick={() => { setIsLoginTab(true); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
                isLoginTab ? 'bg-[#FED547] text-black shadow' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
                !isLoginTab ? 'bg-[#FED547] text-black shadow' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Choice: Trekker vs Organizer (Admin is permanent 1 only) */}
          <div className="space-y-1.5 pt-1">
            <label className="block font-bold text-neutral-800 uppercase text-[10px] tracking-wider">
              {isLoginTab ? 'Role Category (for Google / Phone Sign In)' : '1. What account do you want to create?'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRoleSelection('TREKKER')}
                className={`p-2.5 rounded-2xl border-2 text-left transition transform hover:scale-[1.01] ${
                  roleSelection === 'TREKKER'
                    ? 'border-black bg-brand-pastelYellow font-bold shadow ring-2 ring-black'
                    : 'border-neutral-200 text-neutral-700 bg-neutral-50 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-brand-orange" />
                  <span className="font-heading text-xs text-black">Trekker</span>
                </div>
                <p className="text-[9px] text-neutral-600 font-normal leading-tight mt-0.5">
                  Explore trails &amp; book passes
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRoleSelection('ORGANIZER')}
                className={`p-2.5 rounded-2xl border-2 text-left transition transform hover:scale-[1.01] ${
                  roleSelection === 'ORGANIZER'
                    ? 'border-black bg-brand-pastelYellow font-bold shadow ring-2 ring-black'
                    : 'border-neutral-200 text-neutral-700 bg-neutral-50 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-heading text-xs text-black">Organizer</span>
                </div>
                <p className="text-[9px] text-neutral-600 font-normal leading-tight mt-0.5">
                  Host certified expeditions
                </p>
              </button>
            </div>
            {!isLoginTab && (
              <p className="text-[10px] text-neutral-500 italic">
                * Note: Admin account is permanent (1 only) and cannot be registered publicly.
              </p>
            )}
          </div>

          {/* Google Sign In Button (Firebase Only for Organizer & Trekker) */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border-2 border-black rounded-full font-bold text-xs text-neutral-800 shadow-sm transition transform hover:scale-[1.01] flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {/* Google G SVG Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{isGoogleLoading ? 'Connecting to Google...' : `Continue with Google as ${roleSelection}`}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-neutral-300 w-full" />
            <span className="bg-white px-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Or use
            </span>
            <div className="border-t border-neutral-300 w-full" />
          </div>

          {/* Auth Method Selector Pills: Email vs Phone */}
          <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-300 text-xs">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                authMethod === 'email' ? 'bg-black text-white shadow' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email &amp; Password</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                authMethod === 'phone' ? 'bg-black text-white shadow' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Number Login</span>
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-300 text-red-800 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-800 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* FORM A: Phone Number Login */}
          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSignIn} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 54321"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    id="send-otp-btn"
                    disabled={otpSending || otpCountdown > 0}
                    onClick={handleSendOtp}
                    className="px-3.5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500 font-bold text-xs whitespace-nowrap transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 min-w-[105px]"
                  >
                    {otpSending ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : otpCountdown > 0 ? (
                      <span>Resend in {otpCountdown}s</span>
                    ) : (
                      <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* OTP Sent Notification Banner with 1-Click Auto-Fill */}
              {otpSent && generatedOtpCode && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-950">
                        OTP Sent to Phone!
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        Verification Code: <span className="font-mono font-black text-emerald-900 bg-emerald-200/80 px-1.5 py-0.5 rounded tracking-widest">{generatedOtpCode}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationToken(generatedOtpCode);
                      setSuccessMessage('✓ OTP autofilled into verification field!');
                    }}
                    className="text-[10px] font-extrabold text-emerald-800 bg-emerald-200 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition active:scale-95 shadow-xs"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {!isLoginTab && (
                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Sahyadri Explorer"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-neutral-800 uppercase text-[10px]">
                    6-Digit OTP / Verification Token <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {generatedOtpCode && (
                      <button
                        type="button"
                        onClick={() => setVerificationToken(generatedOtpCode)}
                        className="text-[10px] font-bold text-emerald-700 hover:underline"
                      >
                        Fill OTP ({generatedOtpCode})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={applyEnvVerificationToken}
                      className="text-[10px] font-bold text-brand-orange hover:underline focus:outline-none"
                      title="Load verification token from environment configuration"
                    >
                      Paste Env Token
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    placeholder="Enter 6-digit OTP (e.g. 123456) or token"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm font-mono text-[11px] tracking-wide"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="verify-phone-btn"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-white font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-md transition transform hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify OTP &amp; Sign In as {roleSelection}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORM B: Email & Password */}
          {authMethod === 'email' && (
            <form onSubmit={handleSubmitEmail} className="space-y-3.5 text-xs">
              {!isLoginTab && (
                <>
                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Nilambari Nehete"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Phone Number (for expedition tickets) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98220 54321"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-neutral-800 uppercase text-[10px]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  {isLoginTab && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[10px] font-semibold text-brand-orange hover:underline focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-neutral-400 hover:text-black focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLoginTab && (
                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:outline-none transition shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-2.5 text-neutral-400 hover:text-black focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    className="mt-0.5 rounded border-neutral-300 text-brand-orange focus:ring-brand-primaryYellow cursor-pointer"
                  />
                  <label htmlFor="agree-terms" className="text-[11px] text-neutral-600 leading-tight cursor-pointer">
                    I accept the{' '}
                    <Link to="/terms" className="font-semibold text-black underline">
                      Terms of Service
                    </Link>{' '}
                    and acknowledge the{' '}
                    <Link to="/privacy-policy" className="font-semibold text-black underline">
                      Privacy Policy
                    </Link>.
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-white font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-md transition transform hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLoginTab ? 'Sign In' : `Create ${roleSelection === 'ORGANIZER' ? 'Organizer' : 'Trekker'} Account`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switcher */}
          <div className="text-center pt-2 border-t border-neutral-200 text-xs text-neutral-600">
            {isLoginTab ? (
              <p>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLoginTab(false); setErrorMessage(''); setSuccessMessage(''); }}
                  className="font-bold text-black hover:text-brand-orange underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLoginTab(true); setErrorMessage(''); setSuccessMessage(''); }}
                  className="font-bold text-black hover:text-brand-orange underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-3 border-black rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <h3 className="font-heading text-2xl text-black">Reset Password</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Enter the email associated with your account and we&apos;ll send instructions to reset your password.
            </p>

            {resetSuccess ? (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Password reset link sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:border-black focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-white text-xs font-bold uppercase shadow-sm"
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
