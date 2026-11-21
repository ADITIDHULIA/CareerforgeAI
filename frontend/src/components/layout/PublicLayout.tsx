import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sparkles, Github, Heart } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  CareerForge<span className="text-indigo-400">.AI</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm mb-4">
                Empowering college students and aspiring engineers to target dream internships and placements with AI-driven resume optimization and tailored interview prep.
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span>Production Ready</span>
                <span>•</span>
                <span>Full-Stack Architecture</span>
                <span>•</span>
                <span>Gemini AI Driven</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/#features" className="hover:text-white transition-colors">
                    AI Resume Matching
                  </Link>
                </li>
                <li>
                  <Link to="/#how-it-works" className="hover:text-white transition-colors">
                    Skill Gap Diagnosis
                  </Link>
                </li>
                <li>
                  <Link to="/#how-it-works" className="hover:text-white transition-colors">
                    Mock Interview Questions
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    Student Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Account & Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">
                    Student Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
            <p>© {new Date().getFullYear()} CareerForge AI. Designed for university placements & career preparation.</p>
            <p className="flex items-center space-x-1">
              <span>Built with React, Express, Prisma, PostgreSQL & Google Gemini</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
