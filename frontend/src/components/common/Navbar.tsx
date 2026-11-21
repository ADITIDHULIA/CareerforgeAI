import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                CareerForge<span className="text-indigo-600">.AI</span>
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link to="/#features" className="hover:text-indigo-600 transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="hover:text-indigo-600 transition-colors">
              How it works
            </Link>
            <Link to="/#pricing" className="hover:text-indigo-600 transition-colors">
              Placement Prep
            </Link>
          </div>

          {/* Right Action */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-sm transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="hidden sm:flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                  <UserIcon className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {user?.name}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
