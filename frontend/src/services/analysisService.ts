import { api } from './api';
import { AnalysisReport, DashboardStats } from '../types';

export interface CreateAnalysisPayload {
  resumeId: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
}

export const analysisService = {
  async createAnalysis(payload: CreateAnalysisPayload): Promise<AnalysisReport> {
    const response = await api.post<{ report: AnalysisReport }>('/analyses', payload);
    return response.data.report;
  },

  async getAllAnalyses(): Promise<AnalysisReport[]> {
    const response = await api.get<{ reports: AnalysisReport[] }>('/analyses');
    return response.data.reports;
  },

  async getAnalysisById(id: string): Promise<AnalysisReport> {
    const response = await api.get<{ report: AnalysisReport }>(`/analyses/${id}`);
    return response.data.report;
  },

  async deleteAnalysis(id: string): Promise<void> {
    await api.delete(`/analyses/${id}`);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<{ stats: DashboardStats }>('/dashboard/stats');
    return response.data.stats;
  },
};
