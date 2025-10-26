import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Issue APIs
export const issueAPI = {
  reportIssue: (issueData) => api.post('/issues/report', issueData),
  getAllIssues: () => api.get('/issues/all'),
  getIssuesByStatus: (status) => api.get(`/issues/status/${status}`),
  updateIssueStatus: (id, status) => api.put(`/issues/${id}/status`, { status }),
};

export default api;