import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Filter,
  Building,
  Calendar,
  ArrowRight,
  Trash2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { analysisService } from '../services/analysisService';
import { AnalysisReport } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { getErrorMessage } from '../services/api';

export const AnalysisHistoryPage: React.FC = () => {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<AnalysisReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await analysisService.getAllAnalyses();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let result = reports;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.jobTitle.toLowerCase().includes(term) ||
          (r.company && r.company.toLowerCase().includes(term))
      );
    }

    if (scoreFilter === 'high') {
      result = result.filter((r) => r.matchScore >= 80);
    } else if (scoreFilter === 'medium') {
      result = result.filter((r) => r.matchScore >= 60 && r.matchScore < 80);
    } else if (scoreFilter === 'low') {
      result = result.filter((r) => r.matchScore < 60);
    }

    setFilteredReports(result);
  }, [searchTerm, scoreFilter, reports]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete report for "${title}"?`)) return;

    try {
      await analysisService.deleteAnalysis(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your analysis history..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Analysis Reports History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access, review, and compare your historical resume matching reports.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Match Analysis</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
          />
        </div>

        {/* Score Tier Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-medium flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Score:
          </span>
          <button
            onClick={() => setScoreFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              scoreFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setScoreFilter('high')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              scoreFilter === 'high'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            High 80%+
          </button>
          <button
            onClick={() => setScoreFilter('medium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              scoreFilter === 'medium'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Medium 60-79%
          </button>
          <button
            onClick={() => setScoreFilter('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              scoreFilter === 'low'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Low &lt;60%
          </button>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Reports Saved Yet"
          description="You haven't run any resume analyses yet. Upload a resume and match it against a target job to generate your first report."
          actionText="Run Your First Match"
          actionHref="/analyze"
        />
      ) : filteredReports.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-sm font-semibold text-slate-700">No reports matched your filters</p>
          <p className="text-xs text-slate-500">Try clearing the search term or resetting the score filter.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setScoreFilter('all');
            }}
            className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      report.matchScore >= 80
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : report.matchScore >= 60
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {report.matchScore}% Match
                  </span>
                  {report.company && (
                    <span className="text-xs text-slate-600 font-medium flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {report.company}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 truncate">
                  {report.jobTitle}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl leading-relaxed">
                  {report.summary}
                </p>

                {/* Missing Skills Tags Preview */}
                {report.missingSkills && report.missingSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider self-center mr-1">
                      Gaps:
                    </span>
                    {report.missingSkills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/70 px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                    {report.missingSkills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{report.missingSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
                <Link
                  to={`/reports/${report.id}`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(report.id, report.jobTitle)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
