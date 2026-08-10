import axiosInstance from './axiosInstance';

export interface CreateResumePayload {
  title: string;
  fileUrl?: string;
  fileType?: 'pdf' | 'docx';
  file?: File;
}

export interface UpdateResumePayload {
  title?: string;
  fileUrl?: string;
  fileType?: 'pdf' | 'docx';
  file?: File;
}

export const resumeService = {

  createResume: async (payload: CreateResumePayload | FormData) => {
    let response;
    if (payload instanceof FormData) {
      response = await axiosInstance.post('/api/resume', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      const formData = new FormData();
      formData.append('title', payload.title);
      if (payload.fileUrl) formData.append('fileUrl', payload.fileUrl);
      if (payload.fileType) formData.append('fileType', payload.fileType);
      if (payload.file) formData.append('file', payload.file);

      response = await axiosInstance.post('/api/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return response.data;
  },

  
  getResumes: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/api/resume', {
      params: { page, limit },
    });
    return response.data;
  },

  
  getTemplates: async () => {
    const response = await axiosInstance.get('/api/resume/templates');
    return response.data;
  },

  
  searchResumes: async (query: string, page = 1, limit = 10) => {
    const response = await axiosInstance.get('/api/resume/search', {
      params: { query, page, limit },
    });
    return response.data;
  },


  getResumeById: async (resumeId: string) => {
    const response = await axiosInstance.get(`/api/resume/${resumeId}`);
    return response.data;
  },

  
  updateResume: async (resumeId: string, payload: UpdateResumePayload | FormData) => {
    let response;
    if (payload instanceof FormData) {
      response = await axiosInstance.put(`/api/resume/${resumeId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      const formData = new FormData();
      if (payload.title) formData.append('title', payload.title);
      if (payload.fileUrl) formData.append('fileUrl', payload.fileUrl);
      if (payload.fileType) formData.append('fileType', payload.fileType);
      if (payload.file) formData.append('file', payload.file);

      response = await axiosInstance.put(`/api/resume/${resumeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return response.data;
  },

  
  deleteResume: async (resumeId: string) => {
    const response = await axiosInstance.delete(`/api/resume/${resumeId}`);
    return response.data;
  },

  duplicateResume: async (resumeId: string) => {
    const response = await axiosInstance.post(`/api/resume/${resumeId}/duplicate`);
    return response.data;
  },

  
  shareResume: async (resumeId: string) => {
    const response = await axiosInstance.get(`/api/resume/${resumeId}/share`);
    return response.data;
  },

  
  downloadResume: async (resumeId: string) => {
    const response = await axiosInstance.get(`/api/resume/${resumeId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

 
  exportResume: async (resumeId: string, format: 'pdf' | 'docx' | 'json' = 'pdf') => {
    const response = await axiosInstance.get(`/api/resume/${resumeId}/export`, {
      params: { format },
      responseType: format === 'json' ? 'json' : 'blob',
    });
    return response.data;
  },

 
  analyzeResume: async (resumeId: string) => {
    const response = await axiosInstance.post(`/api/resume/${resumeId}/analyze`);
    return response.data;
  },


  getResumeAnalysis: async (resumeId: string) => {
    const response = await axiosInstance.get(`/api/resume/${resumeId}/analysis`);
    return response.data;
  },
};

export default resumeService;
