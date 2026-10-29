import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionNavProps {
  sections: { id: string; label: string; number: string }[];
}

export const SectionProgressNav: React.FC<SectionNavProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || 'hero-section');

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 select-none"
      aria-label="Section quick navigation"
    >
      <div className="bg-black/85 backdrop-blur-md border border-neutral-700/80 px-3 py-4 rounded-full shadow-2xl flex flex-col items-center gap-3">
        {sections.map(({ id, label, number }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="group relative flex items-center justify-center focus:outline-none"
              title={`${number} - ${label}`}
              aria-label={`Scroll to ${label}`}
            >
              {/* Tooltip Label on hover */}
              <span className="absolute right-full mr-3.5 px-2.5 py-1 rounded-md bg-black text-white text-[10px] font-bold tracking-widest uppercase whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-neutral-800 shadow-md">
                {number} {label}
              </span>

              {/* Dot / Number indicator */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-primaryYellow text-black scale-110 shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {number}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
