import React, { useState } from 'react';
import {
  User,
  Mail,
  Briefcase,
  Building,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { getErrorMessage } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const updated = await authService.updateProfile({
        name,
        targetRole,
        targetCompany,
        bio,
      });
      updateUser(updated);
      setProfileSuccess('Profile information updated successfully!');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setIsLoadingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      const updated = await authService.updateProfile({
        currentPassword,
        newPassword,
      });
      updateUser(updated);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profile & Career Goals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your career target roles, placement goals, and account security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Account Details & Goals */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleProfileSubmit}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5"
          >
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Personal & Target Role Details</h2>
            </div>

            {profileSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100/70 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Job Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dream Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Student Bio & Focus Areas
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Final year computer science student interested in backend architectures, cloud systems, and placement prep."
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isLoadingProfile}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isLoadingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Password */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5"
          >
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Lock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
            </div>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                New Password (min. 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoadingPassword}
                className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoadingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>

          {/* Account Security Info Card */}
          <div className="bg-indigo-50/60 rounded-2xl border border-indigo-100 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Protection</span>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Your resume files are securely stored on the server with ownership isolation. The Gemini AI integration executes server-side with strict JSON validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
