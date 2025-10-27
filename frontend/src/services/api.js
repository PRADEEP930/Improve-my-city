import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const issueAPI = {
  reportIssue: (issueData) => api.post('/issues/report', issueData),
  getAllIssues: () => api.get('/issues/all'),
  getIssuesByStatus: (status) => api.get(`/issues/status/${status}`),
  updateIssueStatus: (id, status) => api.put(`/issues/${id}/status`, { status }),
};

export default api;
