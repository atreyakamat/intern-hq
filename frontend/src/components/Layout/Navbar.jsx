import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Upload, Briefcase, LayoutDashboard } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Resumes', icon: Upload },
  { to: '/roles', label: 'Roles', icon: Briefcase },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <BarChart3 className="h-7 w-7 text-indigo-600 group-hover:text-indigo-700 transition" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Intern<span className="text-indigo-600">Sieve</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile nav */}
          <nav className="flex sm:hidden items-center gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`p-2 rounded-lg transition ${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
