import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/auth.js";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await getMe();
                setUser(userData);

                if (!userData && !["/login", "/register"].includes(location.pathname)) {
                    navigate('/login');
                } else if (userData && ["/login", "/register"].includes(location.pathname)) {
                    
                    if (userData.is_admin) {
                        navigate('/admin');
                    } else {
                        navigate('/userDashboard');
                    }
                }
            } catch {
                setUser(null);
                if (!["/login", "/register"].includes(location.pathname)) {
                    navigate('/login');
                }
            }
        };
        checkAuth();
        // Solo vuelve a ejecutar si cambia la ruta
         
    }, [location.pathname, navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}