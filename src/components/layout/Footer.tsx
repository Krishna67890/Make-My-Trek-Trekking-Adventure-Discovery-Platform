import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-14 pb-10 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/Assets/MMT-Web-logo.png"
                alt="Make My Trek"
                className="h-10 w-auto object-contain"
              />
              <span className="font-heading text-2xl text-white">Make My Trek</span>
            </Link>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              Curating authentic Sahyadri adventures with verified mountain guides, real-time tracking updates, and cinematic 3D trail exploration.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-brand-primaryYellow flex-shrink-0" />
              <span>Nashik & Western Ghats, Maharashtra</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-xl text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link to="/treks" className="hover:text-brand-primaryYellow transition">
                  Treks
                </Link>
              </li>
              <li>
                <a href="/#live-map" className="hover:text-brand-primaryYellow transition">
                  Live Map
                </a>
              </li>
              <li>
                <Link to="/blog" className="hover:text-brand-primaryYellow transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-primaryYellow transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-primaryYellow transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Email (matching Canva design) */}
          <div>
            <h3 className="font-heading text-xl text-white mb-4">Contact</h3>
            <div className="space-y-4 text-sm text-neutral-400">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Direct Line</p>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Phone className="w-4 h-4 text-brand-primaryYellow" />
                  <span>+91 98220 XXXXX</span>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Email</p>
                <div className="flex items-center gap-2 text-neutral-200">
                  <Mail className="w-4 h-4 text-brand-primaryYellow" />
                  <a href="mailto:abcde@makemytrek.com" className="hover:text-brand-primaryYellow transition">
                    abcde@makemytrek.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Social Media (matching Canva design with handle placeholders) */}
          <div>
            <h3 className="font-heading text-xl text-white mb-4">Social Media</h3>
            <div className="space-y-3 text-sm text-neutral-300">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-brand-primaryYellow transition"
              >
                <Instagram className="w-5 h-5 text-neutral-200" />
                <span className="text-xs tracking-wider">@makemytrek</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-brand-primaryYellow transition"
              >
                <Facebook className="w-5 h-5 text-neutral-200" />
                <span className="text-xs tracking-wider">Make My Trek</span>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 hover:text-brand-primaryYellow transition"
              >
                <Twitter className="w-5 h-5 text-neutral-200" />
                <span className="text-xs tracking-wider">@makemytrek</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Make My Trek. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-neutral-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-neutral-400 transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
