import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Menu, X, Sparkles, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex max-w-full">
            <div className="w-64 bg-slate-900 shadow-2xl">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900">CareerForge AI</span>
            </div>
            <div className="hidden lg:block text-xs font-medium text-slate-600">
              Placement & Internship Readiness Workspace
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/analyze"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-700">
                {user?.name}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
