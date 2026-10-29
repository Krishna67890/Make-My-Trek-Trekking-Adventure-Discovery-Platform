import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#FED547] py-14 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
            Terms of Service
          </span>
          <h1 className="font-heading text-5xl text-black">Terms &amp; Conditions</h1>
          <p className="text-xs text-neutral-700">Last updated: October 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-neutral-800 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">1. Adventure Participation &amp; Fitness</h2>
          <p>
            Trekking in the Sahyadri mountains involves physical exertion across uneven terrain, rock steps, and steel ladders. Participants are required to truthfully declare known medical conditions to expedition organizers prior to departure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">2. Cancellation &amp; Refund Policy</h2>
          <p>
            Cancellations made 48 hours or more prior to the trek reporting time qualify for a full refund minus nominal processing charges. Cancellations within 48 hours or no-shows are non-refundable due to non-recoverable village food and forest permit preparation costs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">3. Weather &amp; Forest Closures</h2>
          <p>
            In the event of severe weather warnings, flash flood advisories, or forest department closures, the organizer reserves the right to alter the route or reschedule the batch in the interest of human safety.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">4. Leave No Trace &amp; Code of Conduct</h2>
          <p>
            Littering plastic, consuming alcohol or narcotics, or defacing historical fort ruins is strictly prohibited and results in immediate disqualification from the expedition without refund.
          </p>
        </section>
      </div>
    </div>
  );
};
