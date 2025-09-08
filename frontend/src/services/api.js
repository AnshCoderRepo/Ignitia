import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getProfile = () => api.get('/auth/profile');

// Auth API calls
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const logout = () => api.post('/auth/logout');
// Books API calls
export const getAvailableBooks = () => api.get('/books/available');
export const searchBooks = (query) => api.get(`/books/search?query=${query}`);
export const getAllBooks = () => api.get('/books/all');
export const getMyBooks = () => api.get('/books/my-books');
export const addBook = (bookData) => api.post('/books', bookData);
export const updateBookCopies = (id, totalCopies) => api.put(`/books/${id}/copies`, { totalCopies });

// Borrow API calls
export const borrowBook = (id) => api.post(`/borrow/${id}`);
export const returnBook = (id) => api.post(`/return/${id}`);

export default api;