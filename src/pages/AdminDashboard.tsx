import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, Navigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Compass,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  CreditCard,
  Search,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, role } = useAuth();
  const {
    treks,
    organizers,
    bookings,
    approveTrek,
    rejectTrek,
    approveOrganizer,
    rejectOrganizer,
    cancelBooking,
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'organizers' | 'treks' | 'bookings'>('overview');
  const [rejectModal, setRejectModal] = useState<{ type: 'trek' | 'organizer'; id: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [bookingFilter, setBookingFilter] = useState('ALL');

  // Role Protection Guard
  if (role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black rounded-3xl p-8 max-w-md text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-3xl text-black">Master Admin Access</h2>
          <p className="text-sm text-neutral-600">
            The Admin Dashboard is restricted to the confirmed permanent platform administrator.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/auth"
              className="px-5 py-2.5 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs uppercase shadow transition hover:bg-brand-orange hover:text-white"
            >
              Sign In as Admin
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-800 font-bold text-xs hover:bg-neutral-200 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Statistical aggregates
  const pendingTreks = treks.filter((t) => t.status === 'PENDING');
  const approvedTreks = treks.filter((t) => t.status === 'APPROVED');
  const pendingOrgs = organizers.filter((o) => o.status === 'PENDING');
  const approvedOrgs = organizers.filter((o) => o.status === 'APPROVED');
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'CAPTURED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleConfirmRejection = () => {
    if (!rejectModal || !rejectionReason.trim()) return;
    if (rejectModal.type === 'trek') {
      rejectTrek(rejectModal.id, rejectionReason);
    } else {
      rejectOrganizer(rejectModal.id, rejectionReason);
    }
    setRejectModal(null);
    setRejectionReason('');
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    return b.bookingStatus === bookingFilter;
  });

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Top Banner */}
      <div className="bg-black text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primaryYellow mb-1">
              <Shield className="w-4 h-4" />
              <span>Master Administrative Console</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl text-white">
              Platform Governance
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-2xl text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-300">Live Secure Mode &bull; {user?.displayName}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
          {[
            { id: 'overview', label: 'Overview Metrics' },
            { id: 'organizers', label: `Organizer Verifications (${pendingOrgs.length} Pending)` },
            { id: 'treks', label: `Trek Submissions (${pendingTreks.length} Pending)` },
            { id: 'bookings', label: `Bookings & Payments (${bookings.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition ${
                activeTab === tab.id
                  ? 'bg-brand-primaryYellow border-black text-black shadow-md'
                  : 'bg-white border-neutral-300 text-neutral-600 hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview Metrics */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm">
                <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                  Approved Treks
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-heading text-4xl text-black">{approvedTreks.length}</span>
                  <span className="text-xs font-semibold text-brand-orange bg-brand-pastelYellow/50 px-2.5 py-1 rounded-full">
                    {pendingTreks.length} Pending
                  </span>
                </div>
              </div>

              <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm">
                <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                  Active Organizers
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-heading text-4xl text-black">{approvedOrgs.length}</span>
                  <span className="text-xs font-semibold text-brand-orange bg-brand-pastelYellow/50 px-2.5 py-1 rounded-full">
                    {pendingOrgs.length} Applications
                  </span>
                </div>
              </div>

              <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm">
                <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                  Total Bookings
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-heading text-4xl text-black">{bookings.length}</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length} Confirmed
                  </span>
                </div>
              </div>

              <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm">
                <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                  Total Volume
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-heading text-4xl text-brand-orange">₹{totalRevenue}</span>
                  <span className="text-xs font-semibold text-neutral-500">Razorpay Verified</span>
                </div>
              </div>
            </div>

            {/* Quick action reminders */}
            <div className="bg-[#FED547] border-2 border-black rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl text-black">
                  Action Required: {pendingOrgs.length + pendingTreks.length} Pending Approvals
                </h3>
                <p className="text-xs sm:text-sm text-neutral-800 mt-1">
                  Ensure all organizer certifications, trail routes, and safety protocols are strictly validated before making them public.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('organizers')}
                className="px-6 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-neutral-800 transition whitespace-nowrap"
              >
                Review Applications
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Organizer Verifications */}
        {activeTab === 'organizers' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <h2 className="font-heading text-3xl text-black">Organizer Applications</h2>

            <div className="space-y-4">
              {organizers.map((org) => (
                <div
                  key={org.id}
                  className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading text-2xl text-black">{org.organizationName}</h3>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          org.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : org.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {org.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600">
                      <b>Contact:</b> {org.contactPerson} &bull; {org.email} &bull; {org.phone}
                    </p>
                    <p className="text-xs text-neutral-600">
                      <b>Experience:</b> {org.experienceYears} Years &bull; <b>Credentials:</b>{' '}
                      {org.certifications || 'Under verification'}
                    </p>
                    <p className="text-xs text-neutral-800 bg-neutral-50 p-3 rounded-xl border border-neutral-200 leading-relaxed">
                      {org.bio}
                    </p>
                    {org.rejectionReason && (
                      <p className="text-xs text-red-600 font-semibold">
                        Rejection reason: {org.rejectionReason}
                      </p>
                    )}
                  </div>

                  {org.status === 'PENDING' && (
                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => approveOrganizer(org.id)}
                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setRejectModal({ type: 'organizer', id: org.id })}
                        className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-full border-2 border-red-500 text-red-600 font-bold text-xs hover:bg-red-50 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Trek Submissions */}
        {activeTab === 'treks' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <h2 className="font-heading text-3xl text-black">Trek Catalog Moderation</h2>

            <div className="space-y-4">
              {treks.map((trek) => (
                <div
                  key={trek.id}
                  className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={trek.images[0] || '/Assets/Anjenery-hills-1.png'}
                      alt={trek.title}
                      className="w-24 h-24 rounded-2xl object-cover border border-black/20 flex-shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-2xl text-black">{trek.title}</h3>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                            trek.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : trek.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {trek.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        {trek.location} &bull; ₹{trek.price} &bull; {trek.duration} &bull; {trek.difficulty}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Organizer: <b>{trek.organizerName}</b> &bull; Capacity: {trek.capacity} Trekkers
                      </p>
                      {trek.rejectionReason && (
                        <p className="text-xs text-red-600 font-semibold">
                          Rejection note: {trek.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {trek.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => approveTrek(trek.id)}
                          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve &amp; Publish</span>
                        </button>

                        <button
                          onClick={() => setRejectModal({ type: 'trek', id: trek.id })}
                          className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-full border-2 border-red-500 text-red-600 font-bold text-xs hover:bg-red-50 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {trek.status === 'APPROVED' && (
                      <button
                        onClick={() => setRejectModal({ type: 'trek', id: trek.id })}
                        className="px-4 py-1.5 rounded-full border border-neutral-300 text-neutral-600 text-xs hover:bg-neutral-100 font-medium"
                      >
                        Revoke / Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Bookings & Payments */}
        {activeTab === 'bookings' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-heading text-3xl text-black">Booking Transactions</h2>

              {/* Status Filter */}
              <div className="flex gap-2">
                {['ALL', 'CONFIRMED', 'PENDING_PAYMENT', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                      bookingFilter === st
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-600 border-neutral-300 hover:border-black'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FED547] border-b-2 border-black text-black uppercase font-bold tracking-wider">
                      <th className="p-4">Reference</th>
                      <th className="p-4">Trek</th>
                      <th className="p-4">Lead Trekker</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Trekkers</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Booking Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50 transition">
                        <td className="p-4 font-mono font-bold">{b.id}</td>
                        <td className="p-4 font-medium">{b.trekTitle}</td>
                        <td className="p-4">
                          <p className="font-semibold text-black">{b.trekkerName}</p>
                          <p className="text-[10px] text-neutral-500">{b.trekkerEmail}</p>
                        </td>
                        <td className="p-4">{b.bookingDate}</td>
                        <td className="p-4 font-bold">{b.participants.length}</td>
                        <td className="p-4 font-bold text-brand-orange">₹{b.totalAmount}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.paymentStatus === 'CAPTURED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.bookingStatus === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.bookingStatus === 'CANCELLED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          {b.bookingStatus !== 'CANCELLED' && (
                            <button
                              onClick={() => cancelBooking(b.id, 'Cancelled by administrator')}
                              className="text-red-600 hover:text-red-800 font-bold hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal with Feedback */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-4 border-black rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-heading text-2xl text-black">
              Specify Rejection Reason
            </h3>
            <p className="text-xs text-neutral-600">
              Provide actionable feedback for the {rejectModal.type} submitter.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete route GPS data or missing mountain guide first aid credentials..."
              className="w-full p-3 rounded-xl border-2 border-neutral-300 text-xs focus:border-black focus:outline-none"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Back
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
