import axios from 'axios';

// Use deployed backend - NO MORE LOCALHOST!
const API_BASE_URL = 'https://improve-my-city-jntn.onrender.com/api';

console.log('🔗 Using API URL:', API_BASE_URL);

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
