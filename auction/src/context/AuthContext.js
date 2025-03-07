import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(() => {
        const token = localStorage.getItem('authToken');
        return token ? { token, user: jwtDecode(token) } : null;
    });

    useEffect(() => {
        if (authData) {
            localStorage.setItem('authToken', authData.token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [authData]);

    const loginUser = (data) => {
        setAuthData({ token: data, user: jwtDecode(data) });
    };

    const logoutUser = () => {
        setAuthData(null);
    };

    return (
        <AuthContext.Provider value={{ authData, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
