import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(false); // Can be used for initial token validation if needed

    useEffect(() => {
        // Sync state with local storage strictly
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        setIsAuthenticated(!!storedToken);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/admin/login", { email, password });
            const newToken = response.data.token;
            localStorage.setItem("token", newToken);
            setToken(newToken);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                message: error.response?.data?.error || "Login failed"
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
