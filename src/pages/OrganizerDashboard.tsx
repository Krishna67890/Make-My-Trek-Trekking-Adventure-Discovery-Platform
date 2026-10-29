import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Plus, Compass, Users, Calendar, AlertCircle, CheckCircle, Edit3, X, ShieldCheck } from 'lucide-react';
import { Trek, ItineraryItem } from '../types';

export const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { treks, addTrek, updateTrek, bookings, organizers } = useData();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTrek, setEditingTrek] = useState<Trek | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black rounded-3xl p-8 max-w-md text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-3xl text-black">Organizer Sign In Required</h2>
          <p className="text-sm text-neutral-600">
            Please sign in to your Organizer account to publish expeditions, manage routes, and view trekker bookings.
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
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form states for Create Trek
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(950);
  const [duration, setDuration] = useState('1 Day');
  const [difficulty, setDifficulty] = useState<any>('Moderate');
  const [capacity, setCapacity] = useState(30);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [datesInput, setDatesInput] = useState('2026-11-15, 2026-11-22, 2026-11-29');

  // Find organizer profile
  const orgProfile = organizers.find((o) => o.email === user?.email) || organizers[0];
  const isApproved = orgProfile?.status === 'APPROVED';

  // Filter treks owned by this organizer (or fallback to Sahyadri Explorers Guild for demo)
  const myTreks = treks.filter(
    (t) => t.organizerId === orgProfile?.id || t.organizerName.includes('Sahyadri') || true
  );

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setAddress('');
    setPrice(950);
    setDuration('1 Day');
    setDifficulty('Moderate');
    setCapacity(30);
    setShortDescription('');
    setDescription('');
    setEditingTrek(null);
  };

  const handleSubmitTrek = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDates = datesInput.split(',').map((d) => d.trim()).filter(Boolean);

    if (editingTrek) {
      updateTrek(editingTrek.id, {
        title,
        location,
        address,
        price,
        duration,
        difficulty,
        capacity,
        shortDescription,
        description,
        availableDates: parsedDates,
      });
    } else {
      addTrek({
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        shortDescription,
        description,
        organizerId: orgProfile?.id || 'org-sahyadri-explorers',
        organizerName: orgProfile?.organizationName || user?.displayName || 'Sahyadri Explorers Guild',
        location,
        address: address || `${location}, Maharashtra`,
        coordinates: { lat: 19.9238, lng: 73.5786, altitude: 1200 },
        duration,
        difficulty,
        price,
        currency: 'INR',
        capacity,
        availableDates: parsedDates,
        images: ['/Assets/Anjenery-hills-1.png', '/Assets/3.png'],
        itinerary: [
          { day: 1, title: 'Base Meeting & Ascent', details: 'Gathering at base camp followed by guided safety hike.' }
        ],
        inclusions: ['Certified Wilderness First Responder Guide', 'Permits & Meals'],
        exclusions: ['Personal gear', 'Transport'],
      });
    }

    resetForm();
    setCreateModalOpen(false);
  };

  const handleEditClick = (trek: Trek) => {
    setEditingTrek(trek);
    setTitle(trek.title);
    setLocation(trek.location);
    setAddress(trek.address || '');
    setPrice(trek.price);
    setDuration(trek.duration);
    setDifficulty(trek.difficulty);
    setCapacity(trek.capacity);
    setShortDescription(trek.shortDescription);
    setDescription(trek.description);
    setDatesInput(trek.availableDates.join(', '));
    setCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Banner */}
      <div className="bg-neutral-950 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primaryYellow mb-1">
              <Compass className="w-4 h-4" />
              <span>Expedition Organizer Portal</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl text-white">
              {orgProfile?.organizationName || 'Sahyadri Explorers Guild'}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Lead Trek Leader: {user?.displayName} &bull; {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/profile"
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition shadow"
            >
              My Profile
            </Link>
            <button
              onClick={() => { resetForm(); setCreateModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs sm:text-sm shadow hover:bg-brand-orange hover:text-white transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Trek</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Verification Status Banner */}
        <div
          className={`border-2 rounded-3xl p-5 flex items-start gap-4 shadow-sm ${
            isApproved
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          {isApproved ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-heading text-xl">
              {isApproved
                ? 'Certified Organizer Account Active'
                : 'Account Application Pending Verification'}
            </h3>
            <p className="text-xs mt-0.5 leading-relaxed">
              {isApproved
                ? 'Your mountaineering credentials and forest permits are verified. New treks submitted will be reviewed and published to the live platform.'
                : 'Our safety administration team is verifying your Basic Mountaineering (BMC/AMC) certification and insurance. You may draft treks while approval is in progress.'}
            </p>
          </div>
        </div>

        {/* My Treks Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-3xl text-black">My Managed Treks</h2>
            <span className="text-xs font-semibold text-neutral-500">
              {myTreks.length} expeditions listed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTreks.map((trek) => (
              <div
                key={trek.id}
                className="bg-white border-2 border-black rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-black/15">
                    <img
                      src={trek.images[0] || '/Assets/Anjenery-hills-1.png'}
                      alt={trek.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shadow ${
                          trek.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                            : trek.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border-amber-400'
                            : 'bg-rose-100 text-rose-800 border-rose-400'
                        }`}
                      >
                        {trek.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl text-black mt-3">{trek.title}</h3>
                  <p className="text-xs text-neutral-600 mt-0.5">{trek.location}</p>

                  <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-neutral-100">
                    <span className="font-bold text-brand-orange">₹{trek.price} / person</span>
                    <span className="text-neutral-500">
                      {trek.bookedCount || 0} / {trek.capacity} Booked
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleEditClick(trek)}
                    className="flex-1 py-2 rounded-full border-2 border-black text-xs font-bold hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Expedition</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participant Lists for Upcoming Batches */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-3xl text-black">Recent Trekker Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FED547] border-b-2 border-black text-black uppercase font-bold tracking-wider">
                  <th className="p-3">Reference</th>
                  <th className="p-3">Trek</th>
                  <th className="p-3">Trekker Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Group Size</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50">
                    <td className="p-3 font-mono font-bold">{b.id}</td>
                    <td className="p-3">{b.trekTitle}</td>
                    <td className="p-3 font-semibold">{b.trekkerName}</td>
                    <td className="p-3">{b.trekkerPhone}</td>
                    <td className="p-3 font-bold">{b.participants.length}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Trek Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-4 border-black rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading text-2xl text-black">
                {editingTrek ? 'Edit Trek Details' : 'Submit New Trek Expedition'}
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTrek} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Trek Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Anjaneri Hills Trek"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Location Region</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Nashik, Maharashtra"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Exact Address / Meeting Point</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Anjaneri Fort, Nasik Trimbakeshwar Road, Anjneri, Nashik - 422213"
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2-3 hrs"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Easy - Moderate">Easy - Moderate</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Short Card Description</label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence summary for cards"
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Full Trail Overview</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed trail information, terrain overview, and cultural history..."
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">
                  Batch Dates (Comma-separated YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  required
                  value={datesInput}
                  onChange={(e) => setDatesInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-700 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-white font-bold shadow"
                >
                  {editingTrek ? 'Update & Submit for Review' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
