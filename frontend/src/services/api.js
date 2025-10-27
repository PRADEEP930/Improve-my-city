import axios from 'axios';

const API_BASE_URL = 'https://improve-my-city-jntn.onrender.com/api';

// Create axios instance with better defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const issueAPI = {
  reportIssue: (issueData) => api.post('/issues/report', issueData),
  getAllIssues: () => api.get('/issues/all'),
  getIssuesByStatus: (status) => api.get(`/issues/status/${status}`),
  updateIssueStatus: (id, status) => api.put(`/issues/${id}/status`, { status }),
};

export default api;