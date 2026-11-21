import { api } from './api';
import { Resume } from '../types';

export const resumeService = {
  async upload(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post<{ resume: Resume }>('/resumes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.resume;
  },

  async getAll(): Promise<Resume[]> {
    const response = await api.get<{ resumes: Resume[] }>('/resumes');
    return response.data.resumes;
  },

  async getById(id: string): Promise<Resume> {
    const response = await api.get<{ resume: Resume }>(`/resumes/${id}`);
    return response.data.resume;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/resumes/${id}`);
  },
};
