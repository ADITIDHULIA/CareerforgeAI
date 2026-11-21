import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  Calendar,
  Printer,
  Trash2,
  HelpCircle,
  Lightbulb,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { analysisService } from '../services/analysisService';
import { AnalysisReport } from '../types';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { getErrorMessage } from '../services/api';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTechnical, setExpandedTechnical] = useState<Record<number, boolean>>({});
  const [expandedBehavioral, setExpandedBehavioral] = useState<Record<number, boolean>>({});
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const data = await analysisService.getAnalysisById(id);
        setReport(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const toggleTechnical = (index: number) => {
    setExpandedTechnical((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleBehavioral = (index: number) => {
    setExpandedBehavioral((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDelete = async () => {
    if (!report) return;
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;

    try {
      await analysisService.deleteAnalysis(report.id);
      navigate('/history');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your placement analysis report..." size="lg" />;
  }

  if (error || !report) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Report Not Found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{error || 'Unable to retrieve this report.'}</p>
        <Link
          to="/history"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Analysis History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 print:p-0">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to="/history"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsJDModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>View Job Description</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Export / Print</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete this report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Match Score Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wide">
                Placement Match Report
              </span>
              <span className="text-xs text-slate-400 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {report.jobTitle}
            </h1>

            {report.company && (
              <p className="text-sm font-semibold text-slate-600 flex items-center">
                <Building className="w-4 h-4 mr-1.5 text-indigo-600" />
                {report.company}
              </p>
            )}

            {/* Executive Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Executive Evaluation
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{report.summary}</p>
            </div>

            {report.resume?.fileName && (
              <p className="text-xs text-slate-400 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Analyzed against resume: <span className="font-medium text-slate-600 ml-1">{report.resume.fileName}</span>
              </p>
            )}
          </div>

          {/* Visual Gauge */}
          <div className="lg:col-span-4 flex justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0">
            <ScoreGauge score={report.matchScore} size={170} strokeWidth={14} label="Match Score" />
          </div>
        </div>
      </div>

      {/* Skills Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              Matching Technical Skills ({report.matchingSkills?.length || 0})
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Skills identified on both your resume and the target job description:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {report.matchingSkills?.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No direct skill overlaps identified.</p>
            ) : (
              report.matchingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{skill}</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              Skill Gaps to Address ({report.missingSkills?.length || 0})
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            High priority technologies demanded in the posting that are missing or underrepresented:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {report.missingSkills?.length === 0 ? (
              <p className="text-xs text-emerald-600 font-medium">All key skills matched! Excellent alignment.</p>
            ) : (
              report.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>{skill}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Strengths and Specific Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Standout Resume Strengths</h3>
          </div>
          <ul className="space-y-2.5 pt-1">
            {report.strengths?.map((strength, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Actionable Resume Improvements</h3>
          </div>
          <ul className="space-y-2.5 pt-1">
            {report.improvements?.map((imp, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tailored Interview Preparation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Custom Mock Interview Suite</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Tailored Technical & Behavioral Questions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generated specifically for this role and your background. Click any question to review the model answer and coaching tips.
          </p>
        </div>

        {/* Technical Questions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Technical Deep-Dives
          </h3>
          <div className="space-y-2.5">
            {report.interviewQuestions?.technical?.map((q, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleTechnical(idx)}
                  className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        q.difficulty === 'Hard'
                          ? 'bg-rose-100 text-rose-700'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{q.question}</span>
                  </div>
                  {expandedTechnical[idx] ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {expandedTechnical[idx] && (
                  <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      Expected Answer Concept:
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans bg-indigo-50/40 p-3 rounded-lg border border-indigo-100">
                      {q.expectedAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Questions */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Behavioral / STAR Situations
          </h3>
          <div className="space-y-2.5">
            {report.interviewQuestions?.behavioral?.map((q, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleBehavioral(idx)}
                  className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3"
                >
                  <span className="text-xs font-bold text-slate-800">{q.question}</span>
                  {expandedBehavioral[idx] ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {expandedBehavioral[idx] && (
                  <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      STAR Method Tips:
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                      {q.tips}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Learning Priorities Roadmap */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Prioritized Learning Roadmap
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Targeted study priorities to close gaps before interviewing:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {report.learningPriorities?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{item.skill}</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : item.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center font-medium">
                    <Clock className="w-3 h-3 mr-0.5 text-slate-400" />
                    ~{item.estimatedWeeks}w
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.actionPlan}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for viewing original job description */}
      <Modal
        isOpen={isJDModalOpen}
        onClose={() => setIsJDModalOpen(false)}
        title={`Job Description: ${report.jobTitle}`}
        maxWidth="2xl"
      >
        <pre className="p-4 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed border border-slate-200">
          {report.jobDescription}
        </pre>
      </Modal>
    </div>
  );
};
