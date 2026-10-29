import React from 'react';
import { Compass, ShieldCheck, Heart, Map, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-mountain-theme">
      {/* Top Banner */}
      <div className="bg-[#FED547] py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
            Our Story &bull; Sahyadri Heritage
          </span>
          <h1 className="font-heading text-5xl sm:text-6xl text-black">
            About Make My Trek
          </h1>
          <p className="font-body text-neutral-800 text-sm sm:text-base max-w-2xl mx-auto">
            Born from a deep reverence for the Sahyadri mountains of Maharashtra, Make My Trek brings mountaineering discipline, 3D geographic transparency, and verified safety to every trekker.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FED547]/20 border-2 border-black rounded-3xl p-8 space-y-4 shadow-sm">
            <Compass className="w-8 h-8 text-brand-orange" />
            <h2 className="font-heading text-3xl text-black">Our Mission</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              To eliminate uncertainty in Sahyadri trekking by combining authentic certified mountaineering leaders, real-time weather and trailhead telemetry, and accurate 3D topographic modeling.
            </p>
          </div>

          <div className="bg-[#FED547]/20 border-2 border-black rounded-3xl p-8 space-y-4 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-brand-orange" />
            <h2 className="font-heading text-3xl text-black">Safety First Philosophy</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Every organizer on Make My Trek undergoes strict verification of their Basic Mountaineering Course (BMC/AMC) certifications, first-responder capabilities, and adherence to Leave No Trace (LNT) environmental ethics.
            </p>
          </div>
        </div>

        {/* The Anjaneri Story */}
        <div className="bg-neutral-50 border-2 border-black rounded-3xl p-8 sm:p-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Spotlight on Nashik
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-black">
            The Anjaneri Hills Origin
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            Our journey began on the ancient volcanic plateau of Anjaneri Hills near Trimbakeshwar, Nashik. Standing at 1,280 meters, this sacred mountain inspired our interactive 3D terrain viewer — allowing trekkers to visualize the rock-cut cave trails, the natural footprint-shaped lake, and the Hanuman summit shrine before stepping foot on the trail.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-2">
            <Users className="w-8 h-8 mx-auto text-brand-orange" />
            <h3 className="font-heading text-2xl text-black">Community Powered</h3>
            <p className="text-xs text-neutral-600">
              Direct partnerships with local village homestays and indigenous Sahyadri trail guides.
            </p>
          </div>

          <div className="text-center p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-2">
            <Map className="w-8 h-8 mx-auto text-brand-orange" />
            <h3 className="font-heading text-2xl text-black">Geographic Accuracy</h3>
            <p className="text-xs text-neutral-600">
              Verified GPS trail logs and realistic elevation models, never invented marketing hype.
            </p>
          </div>

          <div className="text-center p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-2">
            <Heart className="w-8 h-8 mx-auto text-brand-orange" />
            <h3 className="font-heading text-2xl text-black">Eco-Conscious Trails</h3>
            <p className="text-xs text-neutral-600">
              Zero-plastic protocols and clean-up drives conducted on every single mountain expedition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
