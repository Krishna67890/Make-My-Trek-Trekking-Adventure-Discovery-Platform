import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-mountain-theme">
      {/* Banner with Mountain Trek Photo */}
      <div
        className="relative py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-black text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(12, 16, 22, 0.72) 0%, rgba(10, 14, 20, 0.9) 100%), url('/Assets/Mountains-1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primaryYellow/20 border border-brand-primaryYellow/40 text-xs font-bold uppercase tracking-widest text-brand-primaryYellow">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get in Touch &bull; Support &amp; Bookings</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl text-white drop-shadow-md">
            Contact Expedition HQ
          </h1>
          <p className="font-body text-neutral-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have questions regarding trail conditions, group custom packages, or guide safety? Reach our team anytime.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-black">
                We're Here on the Trail
              </h2>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                Whether you need advice on difficulty ratings or want to partner as a certified Sahyadri guide, our team is ready to assist.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white border-2 border-black rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-brand-primaryYellow border border-black flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-heading text-xl text-black">Direct Line</h4>
                  <p className="text-sm font-semibold text-neutral-800 mt-0.5">+91 98220 54321</p>
                  <p className="text-[11px] text-neutral-500">Mon &ndash; Sun: 06:00 AM &ndash; 09:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border-2 border-black rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-brand-primaryYellow border border-black flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-heading text-xl text-black">Official Email</h4>
                  <a
                    href="mailto:contact@makemytrek.com"
                    className="text-sm font-semibold text-neutral-800 hover:text-brand-orange mt-0.5 block"
                  >
                    contact@makemytrek.com
                  </a>
                  <p className="text-[11px] text-neutral-500">Average response time: &lt; 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border-2 border-black rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-brand-primaryYellow border border-black flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-heading text-xl text-black">Trailhead Operations</h4>
                  <p className="text-sm text-neutral-800 mt-0.5">
                    Nashik &amp; Trimbakeshwar Base, Western Ghats, Maharashtra &ndash; 422213
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-xl space-y-5">
            <h3 className="font-heading text-3xl text-black">Send a Message</h3>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-400 text-emerald-900 rounded-2xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Thank you! Your message has reached our expedition team. We will get back shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nilambari Nehete"
                  className="w-full p-3 rounded-xl border border-neutral-300 focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 rounded-xl border border-neutral-300 focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Custom Corporate Trek for Anjaneri Hills"
                  className="w-full p-3 rounded-xl border border-neutral-300 focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 uppercase mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what dates or questions you have..."
                  className="w-full p-3 rounded-xl border border-neutral-300 focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-brand-primaryYellow hover:bg-brand-orange text-white font-extrabold text-sm uppercase tracking-wider border-2 border-black shadow transition transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
