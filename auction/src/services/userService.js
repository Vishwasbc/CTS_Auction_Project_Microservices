import apiClient from '../api/apiClient';

const userService = {
  register: (userData) => apiClient.post('/user/register', userData),
  login: (credentials) => apiClient.post('/user/login', credentials),
  getProfile: (id) => apiClient.get(`/user/full-info/${id}`),
  updateUser: (userName, userData) => apiClient.put(`/user/update/${userName}`, userData)
};

export default userService;
