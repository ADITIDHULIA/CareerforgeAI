import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  Sparkles,
  AlertCircle,
  CheckCircle,
  FileCheck,
  Search,
} from 'lucide-react';
import { resumeService } from '../services/resumeService';
import { Resume } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { getErrorMessage } from '../services/api';

export const ResumeUploadPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedResumeForPreview, setSelectedResumeForPreview] = useState<Resume | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const loadResumes = async () => {
    try {
      const data = await resumeService.getAll();
      setResumes(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleFile = async (file: File) => {
    const validExtensions = ['.pdf', '.docx'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setError('Invalid file format. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller resume file.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const uploaded = await resumeService.upload(file);
      setResumes((prev) => [uploaded, ...prev]);
      setSuccessMessage(`Resume "${uploaded.fileName}" uploaded and parsed successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await resumeService.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      setSuccessMessage(`Resume deleted successfully.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Resume Manager
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload and maintain multiple versions of your resume (PDF or DOCX). Our parser automatically extracts skills and structured text.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Upload Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.005]'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>
          <div>
            <p className="text-base font-bold text-slate-800">
              {isUploading ? 'Extracting and parsing resume...' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF (.pdf) and Microsoft Word (.docx) up to 5MB
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Secure Server-Side Text Extraction</span>
            </span>
          </div>
        </div>
      </div>

      {/* Uploaded Resumes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Your Resumes ({resumes.length})
          </h2>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading your resumes..." />
        ) : resumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Resumes Uploaded Yet"
            description="Upload your resume above to start matching with target job descriptions."
            actionText="Upload First Resume"
            onAction={() => fileInputRef.current?.click()}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {resume.fileName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="uppercase font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                        {resume.fileType}
                      </span>
                      <span>•</span>
                      <span>{Math.round(resume.fileSize / 1024)} KB</span>
                      <span>•</span>
                      <span>Uploaded {new Date(resume.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Detected Skills Preview */}
                    {resume.extractedSkills && resume.extractedSkills.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1">
                        {resume.extractedSkills.slice(0, 8).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {resume.extractedSkills.length > 8 && (
                          <span className="text-[10px] font-medium text-slate-400 self-center">
                            +{resume.extractedSkills.length - 8} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => setSelectedResumeForPreview(resume)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Parsed Text</span>
                  </button>

                  <button
                    onClick={() => navigate(`/analyze?resumeId=${resume.id}`)}
                    className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Match with Job</span>
                  </button>

                  <button
                    onClick={() => handleDelete(resume.id, resume.fileName)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parsed Text Preview Modal */}
      <Modal
        isOpen={!!selectedResumeForPreview}
        onClose={() => setSelectedResumeForPreview(null)}
        title={selectedResumeForPreview?.fileName || 'Parsed Resume Text'}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span>Cleaned Text for AI Analysis</span>
            <span>{selectedResumeForPreview?.parsedText?.length || 0} characters</span>
          </div>

          <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
            {selectedResumeForPreview?.parsedText}
          </pre>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                const id = selectedResumeForPreview?.id;
                setSelectedResumeForPreview(null);
                if (id) navigate(`/analyze?resumeId=${id}`);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use This Resume for Job Match</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
