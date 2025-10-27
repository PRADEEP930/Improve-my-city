import axios from 'axios';

const API_BASE_URL = 'https://improve-my-city-jntn.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const issueAPI = {
  reportIssue: (issueData) => api.post('/issues/report', issueData),
  getAllIssues: () => api.get('/issues/all'),
};

export default api;