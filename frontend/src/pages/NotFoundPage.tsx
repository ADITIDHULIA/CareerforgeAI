import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-2 mb-1">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
        The career prep page or analysis report you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
