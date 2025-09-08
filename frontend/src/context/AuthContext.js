import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi, getProfile, logout as logoutApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await getProfile();
            setUser(response.data);
        } catch (error) {
            // Token might be invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await loginApi({ email, password });
            const { token, redirectTo, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, redirectTo };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role = 'member') => {
        try {
            const response = await registerApi({ name, email, password, role });
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            // Call the logout API endpoint if available
            await logoutApi();
        } catch (error) {
            console.error('Logout API call failed:', error);
            // Continue with client-side logout even if API call fails
        } finally {
            // Always clear client-side storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        refreshUser: fetchUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};