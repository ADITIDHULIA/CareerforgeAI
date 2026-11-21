import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Building,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Info,
  Copy,
  Zap,
} from 'lucide-react';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { Resume } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getErrorMessage } from '../services/api';

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Junior Full Stack Software Engineer',
    company: 'NextGen Solutions',
    description: `We are seeking an ambitious Junior Full Stack Software Engineer to build scalable web applications and developer tools.

Responsibilities:
- Design, build, and maintain efficient, reusable, and reliable React/TypeScript frontend components.
- Develop RESTful APIs and backend microservices using Node.js, Express, and PostgreSQL.
- Write clean, well-tested code with comprehensive unit and integration tests (Jest).
- Collaborate with the team on Docker containerization, AWS cloud architecture, and CI/CD automation.
- Optimize database schemas and queries using Prisma or similar ORMs.

Requirements:
- Bachelor's degree in Computer Science, Software Engineering, or related technical field.
- Proficiency in JavaScript/TypeScript, React, Node.js, and relational databases.
- Familiarity with version control (Git/GitHub) and cloud fundamentals (AWS or GCP).
- Strong algorithmic foundations and a passion for building user-centric software products.`,
  },
  {
    title: 'Frontend React Developer Intern',
    company: 'FinTech Pulse',
    description: `FinTech Pulse is looking for a talented Frontend React Developer Intern for our upcoming placement term.

What You'll Do:
- Work alongside senior engineers to create high-performance interactive financial dashboards using React and Vite.
- Implement responsive user interfaces with Tailwind CSS and CSS modules.
- Integrate frontend client with backend REST and GraphQL endpoints.
- Ensure cross-browser compatibility, web accessibility (WCAG), and responsive mobile designs.
- Participate in agile sprint planning, daily standups, and peer code reviews.

What We Look For:
- Strong grasp of modern JavaScript (ES6+), TypeScript, React Hooks, and State Management.
- Familiarity with CSS frameworks such as Tailwind CSS.
- Basic understanding of web performance optimization and bundling.
- High attention to design details and desire to build clean UI/UX.`,
  },
];

export const JobInputPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedResumeId = searchParams.get('resumeId');

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(preselectedResumeId || '');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await resumeService.getAll();
        setResumes(data);
        if (data.length > 0 && !selectedResumeId) {
          setSelectedResumeId(data[0].id);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  const handleApplySample = (sample: (typeof SAMPLE_JOB_DESCRIPTIONS)[0]) => {
    setJobTitle(sample.title);
    setCompany(sample.company);
    setJobDescription(sample.description);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      setError('Please select a resume to analyze.');
      return;
    }

    if (!jobTitle.trim()) {
      setError('Please enter a target job title.');
      return;
    }

    if (jobDescription.trim().length < 30) {
      setError('Job description must be at least 30 characters long to provide an accurate evaluation.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const report = await analysisService.createAnalysis({
        resumeId: selectedResumeId,
        jobTitle: jobTitle.trim(),
        company: company.trim() || undefined,
        jobDescription: jobDescription.trim(),
      });

      navigate(`/reports/${report.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsAnalyzing(false);
    }
  };

  if (isLoadingResumes) {
    return <LoadingSpinner message="Loading your resumes..." size="lg" />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Career Matching</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Resume vs Job Description
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Paste the job requirements from any internship or placement posting. Gemini will calculate your match score, diagnose skill gaps, and prepare custom interview questions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Analysis In-Progress Overlay */}
      {isAnalyzing && (
        <div className="p-8 bg-white border border-indigo-200 rounded-2xl shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Analyzing Resume Against Requirements...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Google Gemini is scanning your technical background, comparing required competencies, detecting missing skills, and drafting tailored interview questions. This usually takes 3 to 6 seconds.
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {!isAnalyzing && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {/* Step 1: Select Resume */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              1. Select Resume *
            </label>
            {resumes.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="text-xs text-amber-800">
                  You haven't uploaded a resume yet. Please upload one first.
                </div>
                <Link
                  to="/resumes"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                >
                  Upload Resume
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resumes.map((resume) => (
                  <label
                    key={resume.id}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedResumeId === resume.id
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resumeSelection"
                      value={resume.id}
                      checked={selectedResumeId === resume.id}
                      onChange={() => setSelectedResumeId(resume.id)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {resume.fileName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {resume.fileType.toUpperCase()} • {Math.round(resume.fileSize / 1024)} KB
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Role and Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Job Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Software Engineer"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Company Name (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Startup"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Quick Samples */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Job Description Text *
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline">Try realistic template:</span>
                {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySample(sample)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-semibold transition-colors"
                  >
                    <Zap className="w-3 h-3 text-indigo-500" />
                    <span>{sample.title.split(' ')[0]} JD</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={9}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job requirements, responsibilities, technical stacks, and qualifications here..."
              className="w-full p-4 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none leading-relaxed placeholder:text-slate-400 font-sans"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Supports up to 20,000 characters</span>
              <span>{jobDescription.length} characters</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-xs text-slate-500 space-x-1.5">
              <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>Uses server-side Gemini AI for structured, objective analysis.</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || resumes.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Placement Report</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
