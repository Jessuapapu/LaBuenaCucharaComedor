import { createContext, useContext, useState, type ReactNode } from 'react';

import type { UserInfo, AuthContextType } from './interfaces';
const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
    // Inicializamos el estado leyendo el localStorage por si el usuario ya estaba logueado
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
    const [usuario, setUsuario] = useState<UserInfo | null>(() => {
        const guardado = localStorage.getItem('user_info');
        return guardado ? JSON.parse(guardado) : null;
    });

    const login = (nuevoToken: string, datosUsuario: UserInfo) => {
        setToken(nuevoToken);
        setUsuario(datosUsuario);
        // Guardamos en el navegador para que no se pierda al recargar (F5)
        localStorage.setItem('access_token', nuevoToken);
        localStorage.setItem('user_info', JSON.stringify(datosUsuario));
    };

    const logout = () => {
        setToken(null);
        setUsuario(null);
        // Limpiamos el navegador
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
    };

    return (
        <AuthContext.Provider value={{ token, usuario, estaAutenticado: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 4. Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};