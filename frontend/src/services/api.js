import axios from 'axios';

// Use deployed backend URL - NOT localhost!
const API_BASE_URL = process.env.NODE_ENV === 'Production' 
  ? 'https://improve-my-city-jntn.onrender.com/api'
  : 'http://localhost:5000/api';

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
