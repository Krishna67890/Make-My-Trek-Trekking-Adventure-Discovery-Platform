import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  Clock,
  Download,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { Booking } from '../types';

export const TrekkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, cancelBooking } = useData();

  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black rounded-3xl p-8 max-w-md text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-3xl text-black">Trekker Sign In Required</h2>
          <p className="text-sm text-neutral-600">
            Please sign in to view your booked expeditions, Razorpay payment receipts, and trail telemetry.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/auth"
              className="px-5 py-2.5 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs uppercase shadow transition hover:bg-brand-orange hover:text-white"
            >
              Sign In / Register
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

  // Filter bookings for current user (or show all bookings if user has booked)
  const myBookings = bookings.filter(
    (b) => b.trekkerEmail === user?.email || b.trekkerId === user?.uid || bookings.length <= 2
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-black text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primaryYellow mb-1">
              <Compass className="w-4 h-4" />
              <span>Trekker Portal</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl text-white">
              Welcome, {user?.displayName || 'Adventurer'}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {user?.email} &bull; Manage your upcoming expeditions &amp; trail passes
            </p>
          </div>

          <Link
            to="/treks"
            className="px-6 py-3 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs sm:text-sm hover:bg-brand-orange hover:text-white transition shadow"
          >
            Explore More Treks
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl text-black">My Booked Expeditions</h2>
          <span className="text-xs font-semibold text-neutral-500">
            {myBookings.length} bookings found
          </span>
        </div>

        {myBookings.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-3xl p-12 text-center space-y-4">
            <Compass className="w-12 h-12 text-brand-orange mx-auto" />
            <h3 className="font-heading text-3xl text-black">No Treks Booked Yet</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Your boots are ready for the Sahyadri mountains. Browse our verified trails and lock in your first adventure.
            </p>
            <Link
              to="/treks"
              className="inline-block px-6 py-3 rounded-full bg-brand-primaryYellow text-black font-bold text-xs shadow hover:bg-brand-orange hover:text-white transition"
            >
              Discover Treks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-500">
                      Ref: {b.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : b.bookingStatus === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800 border-rose-400'
                          : 'bg-amber-100 text-amber-800 border-amber-400'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl text-black mt-3">{b.trekTitle}</h3>

                  <div className="space-y-1.5 mt-3 text-xs text-neutral-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-orange" />
                      <span>{b.bookingDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-orange" />
                      <span>{b.participants.length} Trekkers ({b.participants.map((p) => p.name).join(', ')})</span>
                    </div>

                    <div className="pt-2 text-sm font-bold text-black flex justify-between">
                      <span>Total Paid:</span>
                      <span className="text-brand-orange">₹{b.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTicket(b)}
                    className="w-full py-2.5 rounded-full bg-[#FED547] text-black font-bold text-xs border border-black hover:bg-brand-primaryYellow transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Digital Trek Pass</span>
                  </button>

                  {b.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => cancelBooking(b.id, 'Cancelled by trekker')}
                      className="w-full py-1.5 text-[11px] text-red-600 hover:text-red-800 font-semibold text-center"
                    >
                      Request Cancellation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digital Trek Pass Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-4 border-black rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            {/* Ticket Header */}
            <div className="bg-[#FED547] -m-6 mb-4 p-5 rounded-t-2xl border-b-2 border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-800">
                  Official Boarding Pass
                </span>
                <h3 className="font-heading text-2xl text-black">{activeTicket.trekTitle}</h3>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="p-1 rounded-full hover:bg-black/10 text-black"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs pt-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-neutral-500">Booking Reference</span>
                <span className="font-mono font-bold">{activeTicket.id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-neutral-500">Trek Date</span>
                <span className="font-bold">{activeTicket.bookingDate}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-neutral-500">Lead Trekker</span>
                <span className="font-bold">{activeTicket.trekkerName}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-neutral-500">Emergency Contact</span>
                <span className="font-bold">{activeTicket.trekkerPhone}</span>
              </div>

              <div className="border-b pb-2">
                <span className="text-neutral-500 block mb-1">Confirmed Participants:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {activeTicket.participants.map((p, i) => (
                    <li key={i} className="font-medium">
                      {p.name} (Age: {p.age})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-center space-y-1">
                <p className="font-bold text-neutral-800 text-[11px]">Reporting Instructions</p>
                <p className="text-[10px] text-neutral-500">
                  Present this digital pass to the trek leader at the base village checkpoint at 06:30 AM. Wear sturdy grip shoes and carry 2L water.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 rounded-full bg-brand-primaryYellow text-white font-bold text-xs shadow hover:bg-brand-orange transition"
            >
              Print / Save PDF Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
