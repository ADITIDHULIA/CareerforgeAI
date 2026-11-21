export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  targetRole?: string | null;
  targetCompany?: string | null;
  bio?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  parsedText: string;
  extractedSkills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalQuestion {
  question: string;
  expectedAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface BehavioralQuestion {
  question: string;
  tips: string;
}

export interface InterviewQuestions {
  technical: TechnicalQuestion[];
  behavioral: BehavioralQuestion[];
}

export interface LearningPriority {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  actionPlan: string;
  estimatedWeeks: number;
}

export interface AnalysisReport {
  id: string;
  userId: string;
  resumeId?: string | null;
  jobTitle: string;
  company?: string | null;
  jobDescription: string;
  matchScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];
  interviewQuestions: InterviewQuestions;
  learningPriorities: LearningPriority[];
  createdAt: string;
  updatedAt: string;
  resume?: {
    id: string;
    fileName: string;
  } | null;
}

export interface DashboardStats {
  totalAnalyses: number;
  averageScore: number;
  totalResumes: number;
  topMissingSkills: { skill: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  recentAnalyses: {
    id: string;
    jobTitle: string;
    company?: string | null;
    matchScore: number;
    createdAt: string;
  }[];
}
