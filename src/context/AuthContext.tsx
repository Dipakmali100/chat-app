// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import API_URL from '../constants/API_URL';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setActiveUser } from '../redux/slice/activeUserSlice';
import { toast } from '../hooks/use-toast';

interface User {
    userId: number;
    username: string;
    imgUrl: string;
    verified: boolean;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const[count, setCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log(`useEffect called with count: ${count}`);
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
                        imgUrl: response.data.data.imgUrl,
                        verified: response.data.data.verified,
                        token
                    });
                } else {
                    logout();
                    toast({
                        title: "Authentication error",
                        description: "Please login again",
                        variant: "destructive",
                        duration: 3000
                    })
                }
            } catch (err) {
                setIsAuthenticated(false);
                logout();
                toast({
                    title: "Authentication error", // Error while verifying token
                    description: "Please login again",
                    variant: "destructive",
                    duration: 3000
                })
            }
        }

        checkJwtToken();
    }, [])

    const login = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
        dispatch(setActiveUser({ friendId: 0, username: "", imgUrl: "", verified: false }));
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
