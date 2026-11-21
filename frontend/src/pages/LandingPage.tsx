import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Target,
  Brain,
  MessageSquare,
  Compass,
  BarChart3,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ScoreGauge } from '../components/common/ScoreGauge';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-indigo-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>Next-Gen Placement Preparation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Land Your Dream <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Tech Internship</span> With AI Precision.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                CareerForge AI scans your resume against any job description using Google Gemini to pinpoint missing technical skills, optimize your bullet points, and generate targeted interview questions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all"
                >
                  <span>Start Free Analysis</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-base hover:bg-slate-200 transition-colors"
                >
                  Sign In to Dashboard
                </Link>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-bold text-slate-900">85%+</p>
                  <p className="text-xs text-slate-500">Average Match Goal</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">&lt; 3 sec</p>
                  <p className="text-xs text-slate-500">Gemini AI Analysis</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Student Focused</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Target Role</p>
                      <p className="text-sm font-bold text-slate-800">Software Engineer Intern</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                    Live Preview
                  </span>
                </div>

                <div className="flex items-center justify-center py-2">
                  <ScoreGauge score={88} size={150} strokeWidth={12} label="Job Match" />
                </div>

                {/* Detected & Missing Skills Pills */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                      Matching Strengths
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'Docker'].map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center">
                      <Target className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                      Priority Skill Gaps
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['AWS ECS', 'Kubernetes', 'CI/CD Pipelines'].map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Structured JSON Report</span>
                  <span>Server-side Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="py-20 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              Comprehensive Toolkit
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need To Ace Placement Season
            </h3>
            <p className="mt-4 text-base text-slate-600">
              Designed specifically for college students transitioning into engineering roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Smart Resume Extraction</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your PDF or DOCX resume. Our server securely extracts textual content and identifies your technical proficiencies without third-party exposure.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Gemini AI Job Matching</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Paste any internship or full-time JD. Google Gemini calculates a nuanced alignment score based on real requirements rather than naive keyword counters.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Skill Gap Diagnosis</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Uncover missing libraries, tools, and paradigms before submitting your application so you can adjust your projects and highlight relevant coursework.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Tailored Interview Questions</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get role-specific technical deep-dives with model answers and behavioral STAR questions crafted to probe the intersection of your background and the role.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Learning Action Roadmaps</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive prioritized, estimated-hour roadmaps for high-impact missing skills so you know exactly what to learn over the weekend or prior to an interview.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Historical Report Tracking</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                All analyses are persistently stored in your PostgreSQL dashboard, letting you track your improvement over time across multiple target employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              Simple 3-Step Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From Resume Upload to Interview Preparedness
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Upload Resume</h4>
              <p className="text-sm text-slate-600">
                Submit your existing PDF or DOCX file. The server parses text, formats, and extracts existing proficiencies.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Paste Job Description</h4>
              <p className="text-sm text-slate-600">
                Input the target title, company, and full job posting from LinkedIn, Indeed, or campus placement portal.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Receive Actionable Report</h4>
              <p className="text-sm text-slate-600">
                Get an objective match percentage, bullet point improvements, tailored interview prep, and structured study plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your placement preparation?
          </h2>
          <p className="text-indigo-200 max-w-xl mx-auto text-base">
            Create your account today and gain immediate, data-backed insights on how recruiters view your technical profile.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow-lg shadow-black/20 transition-all text-base"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
