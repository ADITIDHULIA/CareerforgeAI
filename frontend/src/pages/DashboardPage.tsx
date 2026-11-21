import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  TrendingUp,
  Target,
  ArrowRight,
  Clock,
  Building,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { analysisService } from '../services/analysisService';
import { DashboardStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await analysisService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Calculating career readiness metrics..." size="lg" />;
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <h3 className="font-bold text-base mb-1">Failed to load dashboard metrics</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasData = stats && stats.totalAnalyses > 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-700/60 border border-indigo-500/40 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Placement Readiness Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-sm text-indigo-200 leading-relaxed">
            {user?.targetRole
              ? `You're tracking readiness for ${user.targetRole}${
                  user.targetCompany ? ` at ${user.targetCompany}` : ''
                }. Optimize your resume and test your interview skills.`
              : 'Analyze your resume against real job descriptions to identify technical gaps and tailored questions.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/analyze"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-indigo-900 text-xs font-bold hover:bg-indigo-50 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Match New Job Description</span>
            </Link>
            <Link
              to="/resumes"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white text-xs font-semibold border border-indigo-500/30 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Manage Resumes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Analyses"
          value={stats?.totalAnalyses || 0}
          subtitle="Saved job match reports"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Average Match Score"
          value={`${stats?.averageScore || 0}%`}
          subtitle="Across all analyzed jobs"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Uploaded Resumes"
          value={stats?.totalResumes || 0}
          subtitle="Active resume versions"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Top Skill Gap"
          value={stats?.topMissingSkills?.[0]?.skill || 'None detected'}
          subtitle={
            stats?.topMissingSkills?.[0]?.count
              ? `Missing in ${stats.topMissingSkills[0].count} roles`
              : 'Analyze jobs to detect'
          }
          icon={Target}
          color="amber"
        />
      </div>

      {!hasData ? (
        <EmptyState
          icon={Sparkles}
          title="No Job Analyses Yet"
          description="Upload your resume and paste your first target job description to get a comprehensive match score, skill breakdown, and tailored interview questions."
          actionText="Run Your First Match"
          actionHref="/analyze"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recent Analyses Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Job Matches</h3>
                <p className="text-xs text-slate-500">Your latest target role analyses</p>
              </div>
              <Link
                to="/history"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.recentAnalyses.map((item) => (
                <Link
                  key={item.id}
                  to={`/reports/${item.id}`}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {item.jobTitle}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      {item.company && (
                        <span className="flex items-center">
                          <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {item.company}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        item.matchScore >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.matchScore >= 60
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {item.matchScore}% Match
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Skill Gaps and Score Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            {/* Top Missing Skills */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Most Common Skill Gaps</h3>
              </div>
              <p className="text-xs text-slate-500">
                Skills frequently requested in your target job descriptions that were missing on your resume:
              </p>

              <div className="space-y-2.5 pt-1">
                {stats.topMissingSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No missing skills detected yet.</p>
                ) : (
                  stats.topMissingSkills.map((gap) => (
                    <div
                      key={gap.skill}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="text-xs font-semibold text-slate-800">{gap.skill}</span>
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
                        {gap.count} {gap.count === 1 ? 'job' : 'jobs'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Score Distribution Visualizer */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Match Score Distribution</h3>
              <div className="space-y-3 pt-1">
                {stats.scoreDistribution.map((item) => {
                  const percentage =
                    stats.totalAnalyses > 0
                      ? Math.round((item.count / stats.totalAnalyses) * 100)
                      : 0;

                  return (
                    <div key={item.range} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{item.range}</span>
                        <span className="font-bold text-slate-900">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
