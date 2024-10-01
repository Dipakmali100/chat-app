// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import API_URL from '../constants/API_URL';
import axios from 'axios';

interface User {
    userId: number;
    username: string;
    token: string
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const[count, setCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        console.log(`useEffect called with count: ${count}`);
        setCount(count + 1);
        const checkJwtToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.post(`${API_URL}/api/v1/auth/verify`, null, {
                    headers: {
                        Authorization: token
                    }
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setUser({
                        userId: response.data.data.userId,
                        username: response.data.data.username,
                        token
                    });
                } else {
                    logout();
                    alert("Token verification failed");
                }
            } catch (err) {
                console.error("Error while verifying token: ", err);
                setIsAuthenticated(false);
                logout();
            }
        }

        checkJwtToken();
    }, [])

    const login = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', "Bearer " + userData.token);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
