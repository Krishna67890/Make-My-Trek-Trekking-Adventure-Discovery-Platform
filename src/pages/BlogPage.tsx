import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const articles = [
    {
      id: 'anjaneri-hills-complete-guide',
      title: 'Complete Trail Guide: Anjaneri Hills, Nashik (1,280 m)',
      date: 'Oct 24, 2026',
      readTime: '5 min read',
      tag: 'Trail Guide',
      image: '/Assets/Anjenery-hills-1.png',
      summary:
        'A comprehensive breakdown of the ancient Jain caves, the footprint plateau lake, trail difficulty, and best seasons for trekking Anjaneri in Maharashtra.',
    },
    {
      id: 'monsoon-trekking-sahyadri-safety',
      title: 'Essential Safety Protocols for Sahyadri Ladder Ascents',
      date: 'Oct 18, 2026',
      readTime: '7 min read',
      tag: 'Mountaineering Safety',
      image: '/Assets/Mountains-1.png',
      summary:
        'Understanding steel ladder ascents, wet basalt rock grip, and lightning precautions on exposed peaks like Kalsubai and Harishchandragad.',
    },
    {
      id: 'leave-no-trace-maharashtra',
      title: 'Leave No Trace: Preserving the Forts of Western Ghats',
      date: 'Oct 10, 2026',
      readTime: '4 min read',
      tag: 'Conservation',
      image: '/Assets/3.png',
      summary:
        'How trekkers can protect historical fort ramparts, prevent plastic waste in natural cisterns, and respect local indigenous communities.',
    },
  ];

  return (
    <div className="min-h-screen bg-mountain-theme">
      {/* Banner */}
      <div className="bg-[#FED547] py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
            Field Notes &bull; Trail Stories
          </span>
          <h1 className="font-heading text-5xl sm:text-6xl text-black">
            The Trekker's Chronicle
          </h1>
          <p className="font-body text-neutral-800 text-sm sm:text-base max-w-xl mx-auto">
            Mountaineering knowledge, seasonal trail reports, and geological guides from our certified team.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-48 overflow-hidden bg-neutral-100 border-b-2 border-black">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                    <span className="flex items-center gap-1 text-brand-orange font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      {art.tag}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl text-black leading-tight">
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="text-xs font-bold text-black flex items-center gap-1.5 hover:text-brand-orange transition cursor-pointer">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
