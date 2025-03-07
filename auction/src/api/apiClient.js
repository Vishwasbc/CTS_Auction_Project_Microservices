import axios from 'axios';
const apiClient = axios.create({ baseURL: 'http://localhost:8199', });
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken') ? localStorage.getItem('authToken') : null;
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    } return config;
}, (error) => Promise.reject(error));
export default apiClient;