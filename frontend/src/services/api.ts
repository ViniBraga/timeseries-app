import axios, { type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export type FileSummaryItem = {
  name: string;
  total: string;
};

export const fileApi = {
  checkFilenames: async (filenames: string[]): Promise<string[]> => {
    const res = await api.post<AxiosResponse<{ existing: string[] }>>(
      '/check-filenames',
      { filenames }
    );
    return res.data.data.existing;
  },

  uploadFiles: async (files: File[]): Promise<any> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const res = await api.post<{ message: string, data : any }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getSummary: async (): Promise<FileSummaryItem[]> => {
    const res = await api.get<{ data: FileSummaryItem[] }>('/summary');
    return res.data.data;
  },

  downloadFile: (filename: string): string => {
    return `${API_BASE_URL}/download/${filename}`;
  },

  deleteFile: async (filename: string): Promise<void> => {
    await api.delete(`/delete/${filename}`);
  },

  getUploadStatus: async (uploadId: string): Promise<{
    data: 'pending' | 'processing' | 'completed' | 'failed';
  }> => {
    const res = await api.get<{ 
      data: 'pending' | 'processing' | 'completed' | 'failed';
    }>(`/upload-status/${uploadId}`);
    return res.data;
  }
};