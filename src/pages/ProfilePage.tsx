import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Compass,
  Shield,
  ShieldCheck,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Save,
  Mountain,
  Download,
  QrCode,
  ArrowRight,
  ExternalLink,
  HeartPulse,
  LogOut,
  Building,
  Check,
  X,
  FileText,
  Upload,
  Camera,
} from 'lucide-react';
import { Booking } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, role, updateProfile, logout } = useAuth();
  const { bookings, cancelBooking, applyOrganizer, organizers } = useData();
  const navigate = useNavigate();

  // Active Tab: 'personal' | 'bookings' | 'organizer' | 'security'
  const [activeTab, setActiveTab] = useState<'personal' | 'bookings' | 'organizer' | 'security'>('personal');

  // Edit State for Personal Information
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [experienceLevel, setExperienceLevel] = useState<
    'Beginner' | 'Intermediate' | 'Advanced Mountaineer' | 'Certified Guide'
  >(user?.experienceLevel || 'Intermediate');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyPhone || '');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || '/Assets/boy.png'
  );

  // File Upload Handler for Custom Profile Avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFeedbackMessage({ type: 'error', text: 'Please select an image smaller than 5MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        setFeedbackMessage({ type: 'success', text: '✓ Photo uploaded! Click "Save Changes" to update your profile.' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Status feedback
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Organizer Application Form State (UC-O1)
  const [orgAgencyName, setOrgAgencyName] = useState(user?.organizationName || '');
  const [orgContactPerson, setOrgContactPerson] = useState(user?.displayName || '');
  const [orgPhone, setOrgPhone] = useState(user?.phone || '');
  const [orgExperienceYears, setOrgExperienceYears] = useState(4);
  const [orgCertifications, setOrgCertifications] = useState(
    user?.certifications || 'BMC (Basic Mountaineering Course) - NIM Uttarkashi • Wilderness First Responder'
  );
  const [orgBio, setOrgBio] = useState('');
  const [orgSubmittedSuccess, setOrgSubmittedSuccess] = useState(false);

  // E-Ticket modal state
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
        <div className="bg-neutral-900 border-2 border-white/20 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-brand-primaryYellow/20 text-brand-primaryYellow rounded-full flex items-center justify-center mx-auto border border-brand-primaryYellow/50">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-3xl text-white">Sign In Required</h2>
          <p className="text-xs text-neutral-400">
            Please sign in to view and customize your personal explorer profile, booked expeditions, and safety readiness.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/auth"
              className="px-6 py-2.5 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs uppercase shadow transition hover:bg-brand-orange hover:text-white"
            >
              Sign In / Register
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full bg-neutral-800 border border-white/10 text-neutral-300 font-semibold text-xs hover:bg-neutral-700 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter bookings for this user
  const userBookings = bookings.filter(
    (b) =>
      b.trekkerEmail?.toLowerCase() === user.email?.toLowerCase() ||
      b.trekkerId === user.uid ||
      bookings.length <= 2
  );

  // Find organizer application matching this user if exists
  const existingOrgApp = organizers.find((o) => o.email?.toLowerCase() === user.email?.toLowerCase() || o.userId === user.uid);

  // Save Personal Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateProfile({
        displayName,
        phone,
        bio,
        city,
        state,
        experienceLevel,
        bloodGroup,
        emergencyContact,
        emergencyPhone,
        avatarUrl,
      });
      setIsEditing(false);
      setFeedbackMessage({ type: 'success', text: '✓ Personal Profile updated successfully!' });
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
  };

  // Submit Organizer Application (UC-O1)
  const handleSubmitOrganizerApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgAgencyName.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Please enter your organization / agency name.' });
      return;
    }

    applyOrganizer({
      userId: user.uid,
      organizationName: orgAgencyName,
      contactPerson: orgContactPerson || user.displayName,
      email: user.email,
      phone: orgPhone || user.phone || '+91 98220 54321',
      experienceYears: Number(orgExperienceYears),
      certifications: orgCertifications,
      bio: orgBio || `${orgAgencyName} is dedicated to certified mountaineering in the Sahyadri mountains.`,
    });

    updateProfile({
      organizationName: orgAgencyName,
      certifications: orgCertifications,
      role: 'ORGANIZER',
      status: 'PENDING',
    });

    setOrgSubmittedSuccess(true);
    setFeedbackMessage({
      type: 'success',
      text: '✓ Organizer application submitted! Awaiting Master Admin approval as per UC-O1.',
    });
  };

  return (
    <div className="min-h-screen bg-mountain-theme text-black selection:bg-brand-primaryYellow selection:text-black pb-20">
      {/* ========================================================
          HERO PROFILE BANNER & IDENTITY CARD
          ======================================================== */}
      <div className="relative bg-neutral-950 text-white overflow-hidden border-b-4 border-black">
        {/* Ambient Mountain Backdrop */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* User Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt={user.displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-brand-primaryYellow shadow-2xl group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-black border-2 border-brand-primaryYellow text-brand-primaryYellow shadow">
                  {role === 'ADMIN' && <Shield className="w-4 h-4" />}
                  {role === 'ORGANIZER' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  {(role === 'TREKKER' || role === 'USER') && <Compass className="w-4 h-4 text-brand-orange" />}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-heading text-3xl sm:text-4xl text-white">
                    {user.displayName || 'Sahyadri Explorer'}
                  </h1>

                  {/* Account Status Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-brand-primaryYellow text-black shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    {role === 'USER' ? 'User Account' : role}
                  </span>

                  {user.status === 'ACTIVE' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Verified Active
                    </span>
                  )}
                  {user.status === 'PENDING' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Pending Approval
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-300">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-brand-primaryYellow" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-primaryYellow" />
                      {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                    {city}, {state}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 max-w-lg italic line-clamp-2 mt-1">
                  &ldquo;{bio}&rdquo;
                </p>
              </div>
            </div>

            {/* Quick Actions Header Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setActiveTab('personal');
                }}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-primaryYellow" />
                <span>Edit Profile</span>
              </button>

              <Link
                to={role === 'ORGANIZER' ? '/organizer/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/trekker/dashboard'}
                className="px-5 py-2 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-black hover:text-white font-extrabold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 rounded-full bg-neutral-900 hover:bg-red-950 border border-white/15 text-neutral-400 hover:text-red-300 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Booked Expeditions
              </span>
              <span className="font-heading text-2xl text-brand-primaryYellow">{userBookings.length}</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Mountaineer Grade
              </span>
              <span className="font-heading text-xl text-white truncate block">{experienceLevel}</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Blood Group / Safety
              </span>
              <span className="font-heading text-2xl text-emerald-400">{bloodGroup}</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Account Protection
              </span>
              <span className="font-heading text-xl text-brand-primaryYellow">
                {user.email.includes('google') ? 'Google OAuth' : 'Verified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FEEDBACK TOAST
          ======================================================== */}
      {feedbackMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between border shadow-lg animate-in fade-in ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="text-neutral-500 hover:text-black font-bold text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          NAVIGATION TABS
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-neutral-200 border-2 border-black">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center justify-center gap-2 ${
              activeTab === 'personal'
                ? 'bg-brand-primaryYellow text-black shadow-md border border-black'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal &amp; Trekker Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center justify-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-brand-primaryYellow text-black shadow-md border border-black'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings &amp; Passes ({userBookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('organizer')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center justify-center gap-2 ${
              activeTab === 'organizer'
                ? 'bg-brand-primaryYellow text-black shadow-md border border-black'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Organizer Application &amp; Agency</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center justify-center gap-2 ${
              activeTab === 'security'
                ? 'bg-brand-primaryYellow text-black shadow-md border border-black'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Account &amp; Security</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB CONTENT PANELS
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ========================================================
            TAB 1: PERSONAL & TREKKER BIO
            ======================================================== */}
        {activeTab === 'personal' && (
          <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-4">
              <div>
                <h3 className="font-heading text-2xl text-black">Personal Profile &amp; High Altitude Readiness</h3>
                <p className="text-xs text-neutral-500">
                  Manage your personal details, emergency contact information, and mountaineering grade.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-full border-2 border-black text-xs font-bold hover:bg-neutral-100 transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Information'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              {/* Basic Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 disabled:bg-neutral-100 font-medium text-xs focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    Registered Email (Account Key)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600 font-medium text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 54321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 disabled:bg-neutral-100 font-medium text-xs focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune / Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 disabled:bg-neutral-100 font-medium text-xs focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 disabled:bg-neutral-100 font-medium text-xs focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    Trekking Experience Level
                  </label>
                  <select
                    disabled={!isEditing}
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 disabled:bg-neutral-100 font-medium text-xs focus:border-black focus:outline-none"
                  >
                    <option value="Beginner">Beginner (0-2 Treks)</option>
                    <option value="Intermediate">Intermediate (3-10 Sahyadri Forts)</option>
                    <option value="Advanced Mountaineer">Advanced Mountaineer (10+ Technical Climbs)</option>
                    <option value="Certified Guide">Certified Mountaineering Guide</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                  Trekker Bio &amp; Trail Interests
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell fellow trekkers about your favorite Sahyadri forts, peaks, and interests..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 disabled:bg-neutral-100 font-medium text-xs focus:border-black focus:outline-none"
                />
              </div>

              {/* High Altitude & Safety Section */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-brand-orange" />
                  <h4 className="font-heading text-lg text-black">Sahyadri Safety &amp; Emergency Protocol</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Blood Group
                    </label>
                    <select
                      disabled={!isEditing}
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 disabled:bg-white font-medium text-xs"
                    >
                      <option value="O+">O Positive (O+)</option>
                      <option value="O-">O Negative (O-)</option>
                      <option value="A+">A Positive (A+)</option>
                      <option value="A-">A Negative (A-)</option>
                      <option value="B+">B Positive (B+)</option>
                      <option value="B-">B Negative (B-)</option>
                      <option value="AB+">AB Positive (AB+)</option>
                      <option value="AB-">AB Negative (AB-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Emergency Contact Person
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. Ramesh Nehete (Brother)"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 disabled:bg-white font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 98220 00000"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 disabled:bg-white font-medium text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Selection: Default Boy & Girl PNGs + Custom Photo Upload */}
              {isEditing && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-neutral-800 uppercase text-[10px]">
                      Choose Profile Avatar (Boy / Girl Default or Custom Photo)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('/Assets/boy.png')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition ${
                        avatarUrl === '/Assets/boy.png'
                          ? 'border-black bg-brand-primaryYellow/20 shadow-md ring-2 ring-brand-primaryYellow'
                          : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50'
                      }`}
                    >
                      <img
                        src="/Assets/boy.png"
                        alt="Boy Trekker Avatar"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-neutral-300 bg-amber-50"
                      />
                      <div>
                        <span className="font-heading text-sm text-black block leading-tight">Boy Trekker</span>
                        <span className="text-[10px] text-neutral-500 font-medium">boy.png default avatar</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAvatarUrl('/Assets/girl.png')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition ${
                        avatarUrl === '/Assets/girl.png'
                          ? 'border-black bg-brand-primaryYellow/20 shadow-md ring-2 ring-brand-primaryYellow'
                          : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50'
                      }`}
                    >
                      <img
                        src="/Assets/girl.png"
                        alt="Girl Trekker Avatar"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-neutral-300 bg-amber-50"
                      />
                      <div>
                        <span className="font-heading text-sm text-black block leading-tight">Girl Trekker</span>
                        <span className="text-[10px] text-neutral-500 font-medium">girl.png default avatar</span>
                      </div>
                    </button>
                  </div>

                  {/* Upload Custom Photo Option */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-300 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-neutral-800 text-xs block">
                          Upload Custom Photo
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          Upload your real portrait or trekking photo from your device (JPG, PNG, WEBP)
                        </span>
                      </div>

                      <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white font-extrabold text-xs hover:bg-brand-orange transition shadow">
                        <Upload className="w-4 h-4 text-brand-primaryYellow" />
                        <span>Select Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {avatarUrl && !['/Assets/boy.png', '/Assets/girl.png'].includes(avatarUrl) && (
                      <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Custom photo loaded and ready to save</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-black hover:text-white font-extrabold text-xs uppercase shadow transition flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 2: MY BOOKINGS & PASSES (UC-U3, UC-U4)
            ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-4">
              <div>
                <h3 className="font-heading text-2xl text-black">My Booked Expeditions &amp; Trail Passes</h3>
                <p className="text-xs text-neutral-500">
                  Manage your bookings, Razorpay payment receipts, and digital passes.
                </p>
              </div>
              <Link
                to="/treks"
                className="px-4 py-2 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs shadow hover:bg-brand-orange hover:text-white transition"
              >
                Explore More Treks
              </Link>
            </div>

            {userBookings.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Compass className="w-12 h-12 text-brand-orange mx-auto" />
                <h4 className="font-heading text-2xl text-black">No Expeditions Booked Yet</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Browse our handpicked Sahyadri trails and secure your digital trail pass.
                </p>
                <Link
                  to="/treks"
                  className="inline-block mt-2 px-5 py-2 rounded-full bg-black text-white font-bold text-xs"
                >
                  Browse Treks
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl border-2 border-black bg-neutral-50 hover:bg-white transition shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-neutral-500">
                          BOOKING #{b.id}
                        </span>
                        <h4 className="font-heading text-xl text-black">{b.trekTitle}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            b.bookingStatus === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : b.bookingStatus === 'PENDING_PAYMENT'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                        <span className="text-xs font-heading font-black text-black">
                          ₹{b.totalAmount}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-600">
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-bold">DATE</span>
                        <span>{b.bookingDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-bold">MEMBERS</span>
                        <span>{b.participants?.length || 1} Trekker(s)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-bold">PAYMENT</span>
                        <span className="font-mono text-[11px] text-emerald-700 font-semibold">
                          {b.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-bold">RAZORPAY ID</span>
                        <span className="font-mono text-[10px] text-neutral-500 truncate block">
                          {b.razorpayPaymentId || 'pay_demo_rzp_01'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(b)}
                        className="px-3 py-1.5 rounded-lg bg-black text-white font-bold text-xs hover:bg-neutral-800 flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View E-Ticket</span>
                      </button>

                      {b.bookingStatus !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this booking?')) {
                              cancelBooking(b.id, 'Cancelled by user');
                            }
                          }}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: ORGANIZER APPLICATION & AGENCY (UC-O1, UC-O2)
            ======================================================== */}
        {activeTab === 'organizer' && (
          <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b-2 border-neutral-100 pb-4">
              <h3 className="font-heading text-2xl text-black">
                {role === 'ORGANIZER'
                  ? 'Expedition Organizer Portal & Status'
                  : 'Become a Certified Expedition Organizer'}
              </h3>
              <p className="text-xs text-neutral-500">
                {role === 'ORGANIZER'
                  ? 'Your agency application status and commercial expedition hosting privileges.'
                  : 'Host commercial treks on Make My Trek. Submit your credentials for Master Admin review (UC-O1).'}
              </p>
            </div>

            {/* If user is an Organizer or has submitted an application */}
            {role === 'ORGANIZER' || existingOrgApp || orgSubmittedSuccess ? (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-2xl border-2 ${
                    user.status === 'ACTIVE' || existingOrgApp?.status === 'APPROVED'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-amber-50 border-amber-400 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8 text-emerald-700 flex-shrink-0" />
                      <div>
                        <h4 className="font-heading text-xl">
                          {existingOrgApp?.organizationName || user.organizationName || 'Sahyadri Expedition Guild'}
                        </h4>
                        <p className="text-xs text-neutral-600">
                          Contact: {existingOrgApp?.contactPerson || user.displayName} • {existingOrgApp?.email || user.email}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-black text-brand-primaryYellow shadow-sm">
                      Status: {existingOrgApp?.status || user.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-neutral-700 block">Certifications on Record:</span>
                      <span className="text-neutral-600">{existingOrgApp?.certifications || user.certifications || 'Basic Mountaineering Course (BMC)'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-700 block">Experience:</span>
                      <span className="text-neutral-600">{existingOrgApp?.experienceYears || 4} Years in Western Ghats</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-neutral-900">Organizer Expedition Dashboard</h5>
                    <p className="text-[11px] text-neutral-600">
                      Publish new treks, upload itineraries, and manage registered trekkers.
                    </p>
                  </div>
                  <Link
                    to="/organizer/dashboard"
                    className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 font-extrabold text-xs flex items-center gap-1.5 whitespace-nowrap shadow"
                  >
                    <span>Open Organizer Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Registration Form for Aspiring Organizers */
              <form onSubmit={handleSubmitOrganizerApplication} className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950">
                  <p className="font-bold">UC-O1: Organizer Registration Application</p>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    Submitting this form registers your organization in PENDING state. The platform Master Admin will review and approve your credentials before your treks go live.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Organization / Agency Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={orgAgencyName}
                      onChange={(e) => setOrgAgencyName(e.target.value)}
                      placeholder="e.g. Sahyadri Wanderers Adventure Club"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-medium text-xs focus:border-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={orgContactPerson}
                      onChange={(e) => setOrgContactPerson(e.target.value)}
                      placeholder={user.displayName}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-medium text-xs focus:border-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Experience in Mountaineering (Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={orgExperienceYears}
                      onChange={(e) => setOrgExperienceYears(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-medium text-xs focus:border-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                      Certifications &amp; Licenses
                    </label>
                    <input
                      type="text"
                      value={orgCertifications}
                      onChange={(e) => setOrgCertifications(e.target.value)}
                      placeholder="e.g. BMC / AMC from NIM / HMI • First Aid Certified"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-medium text-xs focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 uppercase text-[10px] mb-1">
                    Agency Bio &amp; Sahyadri Track Record
                  </label>
                  <textarea
                    rows={3}
                    value={orgBio}
                    onChange={(e) => setOrgBio(e.target.value)}
                    placeholder="Describe your expedition leadership experience, safety standards, and team guides..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-medium text-xs focus:border-black focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-black hover:text-white font-extrabold text-xs uppercase shadow transition flex items-center gap-1.5"
                  >
                    <span>Submit Organizer Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: SECURITY & CONNECTED ACCOUNTS
            ======================================================== */}
        {activeTab === 'security' && (
          <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b-2 border-neutral-100 pb-4">
              <h3 className="font-heading text-2xl text-black">Account Security &amp; Linked Identities</h3>
              <p className="text-xs text-neutral-500">
                Manage your OAuth connections, platform credentials, and active sessions.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Google OAuth Card */}
              <div className="p-4 rounded-2xl border-2 border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.97 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <div>
                    <h5 className="font-bold text-neutral-900">Google Authentication</h5>
                    <p className="text-[11px] text-neutral-500">
                      {user.email.includes('google')
                        ? 'Connected as verified Google User account'
                        : 'Google OAuth linked with personal user profile'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Connected
                </span>
              </div>

              {/* Phone Verification Card */}
              <div className="p-4 rounded-2xl border-2 border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-orange" />
                  <div>
                    <h5 className="font-bold text-neutral-900">Mobile Phone Authentication</h5>
                    <p className="text-[11px] text-neutral-500">
                      {user.phone ? `Verified mobile number: ${user.phone}` : 'Add a verified mobile number for OTP sign-in'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Verified
                </span>
              </div>

              {/* Session Details */}
              <div className="p-4 rounded-2xl border border-neutral-200 text-neutral-600 space-y-1 text-[11px]">
                <p>
                  <span className="font-bold text-black">User Unique Identifier (UID):</span>{' '}
                  <span className="font-mono text-[10px]">{user.uid}</span>
                </p>
                <p>
                  <span className="font-bold text-black">Account Role:</span>{' '}
                  <span>{user.role}</span>
                </p>
                <p>
                  <span className="font-bold text-black">Member Since:</span>{' '}
                  <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </p>
              </div>

              {/* Sign Out Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase shadow transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          E-TICKET MODAL
          ======================================================== */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b-2 pb-3">
              <div className="flex items-center gap-2">
                <Mountain className="w-6 h-6 text-brand-orange" />
                <h3 className="font-heading text-2xl text-black">Digital Expedition Pass</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 text-white text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-brand-primaryYellow tracking-widest block">
                Official Make My Trek Pass
              </span>
              <h4 className="font-heading text-2xl text-white">{selectedTicket.trekTitle}</h4>
              <p className="text-xs text-neutral-300">Date: {selectedTicket.bookingDate}</p>

              {/* Simulated QR Code */}
              <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto shadow-md flex items-center justify-center">
                <div className="w-full h-full border-4 border-black border-dashed flex flex-col items-center justify-center text-black">
                  <QrCode className="w-16 h-16" />
                  <span className="text-[8px] font-mono font-bold mt-1">VERIFIED PASS</span>
                </div>
              </div>
              <p className="text-[10px] font-mono text-neutral-400">ID: {selectedTicket.id}</p>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-700">
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold">Lead Trekker:</span>
                <span>{selectedTicket.trekkerName}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold">Registered Mobile:</span>
                <span>{selectedTicket.trekkerPhone}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold">Status:</span>
                <span className="font-bold text-emerald-600">{selectedTicket.bookingStatus}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold">Amount Paid:</span>
                <span className="font-bold text-black">₹{selectedTicket.totalAmount}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-black font-extrabold text-xs uppercase shadow flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
