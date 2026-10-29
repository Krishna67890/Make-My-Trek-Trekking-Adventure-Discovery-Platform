import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ChevronDown, User, Shield, Compass, MapPin, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Treks', href: '/treks' },
    { name: 'Live Map', href: '#live-map' },
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const getDashboardRoute = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'ORGANIZER') return '/organizer/dashboard';
    return '/trekker/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-neutral-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-primaryYellow rounded-lg">
          <img
            src="/Assets/MMT-Web-logo.png"
            alt="Make My Trek Logo"
            className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-heading text-xl sm:text-2xl text-white tracking-wide flex items-center">
            Make My Trek
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isHash = link.href.startsWith('#');
            const isActive = !isHash && location.pathname === link.href;

            if (isHash) {
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-neutral-200 hover:text-brand-primaryYellow transition-colors tracking-wide focus:outline-none focus:text-brand-primaryYellow"
                >
                  {link.name}
                </button>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`transition-colors tracking-wide ${
                  isActive
                    ? 'text-brand-primaryYellow font-semibold'
                    : 'text-neutral-200 hover:text-brand-primaryYellow'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Account / Subscription Status */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-700 hover:border-brand-primaryYellow px-3.5 py-1.5 rounded-full text-xs transition-all focus:outline-none"
              >
                {/* Yellow circle avatar indicator matching Canva design */}
                <div className="w-6 h-6 rounded-full bg-brand-primaryYellow flex items-center justify-center text-black font-bold text-xs shadow">
                  {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <span className="font-semibold text-white block max-w-[120px] truncate leading-tight">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-primaryYellow tracking-wider">
                    {user.role} Account
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Dropdown Menu */}
              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl py-2 z-50 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-800">
                    <p className="font-semibold text-white truncate">{user.displayName}</p>
                    <p className="text-neutral-400 truncate text-[11px]">{user.email}</p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-primaryYellow/20 border border-brand-primaryYellow/40 text-[10px] font-bold text-brand-primaryYellow">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{user.role} &bull; {user.status}</span>
                    </div>
                  </div>

                  <Link
                    to={getDashboardRoute()}
                    onClick={() => setRoleDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-neutral-200 hover:bg-neutral-800 hover:text-brand-primaryYellow transition"
                  >
                    {role === 'ADMIN' && <Shield className="w-4 h-4 text-brand-primaryYellow" />}
                    {role === 'ORGANIZER' && <Compass className="w-4 h-4 text-brand-primaryYellow" />}
                    {role === 'TREKKER' && <MapPin className="w-4 h-4 text-brand-primaryYellow" />}
                    <span className="font-medium">{role} Dashboard</span>
                  </Link>

                  <button
                    onClick={() => { logout(); setRoleDropdownOpen(false); navigate('/'); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-neutral-800 transition border-t border-neutral-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2.5 text-sm font-medium hover:text-brand-primaryYellow transition group"
            >
              <div className="w-8 h-8 rounded-full bg-brand-primaryYellow flex items-center justify-center text-black shadow-sm group-hover:scale-105 transition-transform">
                <User className="w-4 h-4 text-black" />
              </div>
              <span className="text-white text-xs tracking-wider font-semibold">Login / Signup</span>
            </Link>
          )}
        </div>

        {/* Mobile menu & account button (responsive display across all devices) */}
        <div className="md:hidden flex items-center gap-2.5">
          {user ? (
            <Link
              to={getDashboardRoute()}
              className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded-full text-xs text-white"
            >
              <div className="w-6 h-6 rounded-full bg-brand-primaryYellow flex items-center justify-center text-black font-bold text-xs">
                {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-[10px] font-bold text-brand-primaryYellow uppercase">{user.role}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="px-3 py-1 bg-brand-primaryYellow text-black font-bold text-xs rounded-full shadow-sm"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-brand-primaryYellow focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-t border-neutral-800 px-5 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => {
            const isHash = link.href.startsWith('#');
            if (isHash) {
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left py-2 text-neutral-200 hover:text-brand-primaryYellow font-medium"
                >
                  {link.name}
                </button>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-neutral-200 hover:text-brand-primaryYellow font-medium"
              >
                {link.name}
              </Link>
            );
          })}

          {/* Account status display in mobile drawer */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            {user ? (
              <>
                <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span className="truncate max-w-[170px] font-semibold text-white">{user.displayName}</span>
                    <span className="bg-brand-primaryYellow text-black px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                </div>

                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs shadow"
                >
                  Go to {user.role} Dashboard
                </Link>

                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                  className="w-full text-center py-2 text-xs text-red-400 hover:text-red-300 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-full bg-brand-primaryYellow text-black font-extrabold text-xs shadow"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
