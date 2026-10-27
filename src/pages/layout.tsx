import type { JSX } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const usuario = localStorage.getItem('user_info');
    const esVistaClienteMesa = location.pathname.startsWith('/cuenta/');

    const Links = () => {
        const hearder: JSX.Element[] = [];
        const footer: JSX.Element[] = [];
        
        if (usuario === null) {
            return { hearder, footer };
        }

        const rol = JSON.parse(usuario)['rol'];

        if (rol === 'MESERO' || rol === 'ADMIN') {
            hearder.push(
                <Link key="mesas-h" to='/mesero'
                    className={`font-semibold transition-colors ${location.pathname === '/mesero' ? 'text-[#14502E]' : 'text-[#6E6658] hover:text-[#B71F30]'}`}>
                    Mesas
                </Link>
            );

            footer.push(
                <Link key="mesas-f" to="/mesero"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/mesero' ? 'text-[#14502E]' : 'text-[#8D8678] hover:text-[#28397F]'}`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="3" y="8" width="18" height="4" rx="1" />
                        <path d="M12 8v13M19 12v9M5 12v9" />
                    </svg>
                    <span className="text-[10px] font-bold">Mesas</span>
                </Link>
            );
        }
        
        if (rol === 'CAJERO' || rol === 'ADMIN') {
            hearder.push(
                <Link key="caja-h" to='/cajero'
                    className={`font-semibold transition-colors ${location.pathname === '/cajero' ? 'text-[#14502E]' : 'text-[#6E6658] hover:text-[#B71F30]'}`}>
                    Caja
                </Link>
            );

            footer.push(
                <Link key="caja-f" to="/cajero"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/cajero' ? 'text-[#14502E]' : 'text-[#8D8678] hover:text-[#28397F]'}`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M12 12h.01M16 9h.01M8 15h.01" />
                        <circle cx="12" cy="12" r="2" />
                    </svg>
                    <span className="text-[10px] font-bold">Caja</span>
                </Link>
            );
        }
        
        if (rol === 'COCINA' || rol === 'ADMIN') {
            hearder.push(
                <Link key="cocina-h" to='/cocina'
                    className={`font-semibold transition-colors ${location.pathname === '/cocina' ? 'text-[#14502E]' : 'text-[#6E6658] hover:text-[#B71F30]'}`}>
                    Cocina
                </Link>
            );

            footer.push(
                <Link key="cocina-f" to="/cocina"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/cocina' ? 'text-[#14502E]' : 'text-[#8D8678] hover:text-[#28397F]'}`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M12 3v18M8 6v5M16 6v5" />
                        <path d="M4 12h16a2 2 0 012 2v2H2v-2a2 2 0 012-2z" />
                    </svg>
                    <span className="text-[10px] font-bold">Cocina</span>
                </Link>
            );
        }
        return { hearder, footer };
    };

    return (
        <div className="min-h-screen bg-[#F6F0E2] flex flex-col font-sans">
            
            {/* 1. HEADER - Fijo en la parte superior */}
            {!esVistaClienteMesa && <header className="sticky top-0 z-40 border-b border-[#9DA968]/35 bg-[#FFF8E7] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-[#28397F] tracking-tight">
                        <Link to='/'>
                            🍽️ La Buena Cuchara
                        </Link>
                    </h1>
                    
                    {/* Menú para desktop */}
                    <nav className="hidden md:flex gap-6">
                        {token && Links().hearder}
                    </nav>
                </div>
            </header>}

            <main className={esVistaClienteMesa ? "flex-1 w-full" : "flex-1 w-full max-w-7xl mx-auto p-4 pb-24 md:pb-8"}>
                <Outlet />
            </main>

            {token && (
                <nav className="md:hidden fixed bottom-0 w-full bg-[#FFF8E7] border-t border-[#9DA968]/40 flex justify-around items-center h-16 z-50 shadow-[0_-5px_16px_rgba(40,57,127,0.08)] pb-safe">
                    {Links().footer}
                </nav>
            )}
        </div>
    );
}