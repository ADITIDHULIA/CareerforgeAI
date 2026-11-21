import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  History,
  User,
  LogOut,
  ChevronRight,
  Target,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', path: '/resumes', icon: FileText },
    { name: 'Analyze Job Match', path: '/analyze', icon: Sparkles, badge: 'AI' },
    { name: 'Analysis Reports', path: '/history', icon: History },
    { name: 'Profile & Goals', path: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-6 h-16 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight">
            CareerForge<span className="text-indigo-400">.AI</span>
          </span>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Career Prep Hub
          </span>
        </div>
      </div>

      {/* Target Role Pill */}
      {user?.targetRole && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Target Goal</span>
          </div>
          <p className="text-xs font-medium text-white truncate">{user.targetRole}</p>
          {user.targetCompany && (
            <p className="text-[11px] text-slate-400 truncate">@ {user.targetCompany}</p>
          )}
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
