import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#FED547] py-14 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-800">
            Legal &amp; Trust
          </span>
          <h1 className="font-heading text-5xl text-black">Privacy Policy</h1>
          <p className="text-xs text-neutral-700">Last updated: October 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-neutral-800 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">1. Information We Collect</h2>
          <p>
            Make My Trek collects contact details (name, email address, phone number), emergency contacts, and participant ages solely to guarantee mountain safety, verify forest department permits, and issue digital trek passes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">2. Payment Processing &amp; Razorpay</h2>
          <p>
            Payment card information, UPI pins, and bank credentials are processed directly through Razorpay's PCI-DSS compliant infrastructure. Make My Trek never stores sensitive CVVs, card numbers, or banking passwords on our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">3. Emergency Telemetry &amp; Location Data</h2>
          <p>
            During active expeditions, real-time checkpoint updates and emergency coordination data may be accessed by certified trek leaders to ensure group accountability and swift rescue operations if required.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-2xl text-black">4. Data Retention &amp; Rights</h2>
          <p>
            Trekkers may request account deletion or data exports at any time by contacting{' '}
            <a href="mailto:abcde@makemytrek.com" className="text-brand-orange font-bold underline">
              abcde@makemytrek.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
