<<<<<<< HEAD
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const esVistaClienteMesa = location.pathname.startsWith('/cuenta/');
    
    return (
        <div className="min-h-screen bg-[#F6F0E2] flex flex-col font-sans">
            
            {/* 1. HEADER - Fijo en la parte superior */}
            {!esVistaClienteMesa && <header className="sticky top-0 z-40 border-b border-[#9DA968]/35 bg-[#FFF8E7] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-[#28397F] tracking-tight">
                        🍽️ La Buena Cuchara
                    </h1>
                    
                    {/* Menú para desktop */}
                    <nav className="hidden md:flex gap-6">
                        {token && (
                            <Link
                                to="/mesero"
                                className={`font-semibold transition-colors ${location.pathname === '/mesero' ? 'text-[#14502E]' : 'text-[#6E6658] hover:text-[#B71F30]'}`}
                            >
                                Mesas
                            </Link>
                        )}
                    </nav>
                </div>
            </header>}

            
            <main className={esVistaClienteMesa ? "flex-1 w-full" : "flex-1 w-full max-w-7xl mx-auto p-4 pb-24 md:pb-8"}>
                <Outlet />
            </main>

            
            {token && (
                    <nav className="md:hidden fixed bottom-0 w-full bg-[#FFF8E7] border-t border-[#9DA968]/40 flex justify-around items-center h-16 z-50 shadow-[0_-5px_16px_rgba(40,57,127,0.08)] pb-safe">
                    
                    <Link 
                        to="/mesero" 
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/mesero' ? 'text-[#14502E]' : 'text-[#8D8678] hover:text-[#28397F]'}`}
                    >
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        <span className="text-[10px] font-bold">Mesas</span>
                    </Link>

                    <Link 
                        to="/ordenes" 
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/ordenes' ? 'text-[#14502E]' : 'text-[#8D8678] hover:text-[#28397F]'}`}
                    >
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        <span className="text-[10px] font-bold">Órdenes</span>
                    </Link>

=======
import type { JSX } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";


export default function Layout() {
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const usuario = localStorage.getItem('user_info')

    const Links = () => {
        const hearder: JSX.Element[] = []
        const footer: JSX.Element[] = []
        if (usuario === null) {
            return { hearder, footer }
        }

        const rol = JSON.parse(usuario)['rol']

        if (rol === 'MESERO' || rol === 'ADMIN') {
            hearder.push(
                <Link to='/mesero'
                    className={`font-medium transition-colors ${location.pathname === '/mesero' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                    Mesas
                </Link>
            )

            footer.push(
                <Link
                    to="/mesero"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/mesero' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="3" y="8" width="18" height="4" rx="1" />
                            <path d="M12 8v13M19 12v9M5 12v9" />
                        </svg>
                    </svg>
                    <span className="text-[10px] font-bold">mesas</span>
                </Link>

            )
        }
        if (rol === 'CAJERO' || rol === 'ADMIN') {
            hearder.push(
                <Link to='/cajero'
                    className={`font-medium transition-colors ${location.pathname === '/cajero' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                    Caja
                </Link>
            )

            footer.push(
                <Link
                    to="/cajero"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/cajero' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M12 12h.01M16 9h.01M8 15h.01" />
                        <circle cx="12" cy="12" r="2" />
                    </svg>
                    <span className="text-[10px] font-bold">caja</span>
                </Link>

            )
        }
        if (rol === 'COCINA' || rol === 'ADMIN') {
            hearder.push(
                <Link to='/cocina'
                    className={`font-medium transition-colors ${location.pathname === '/cocina' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                    Cocina
                </Link>
            )

            footer.push(
                <Link
                    to="/cocina"
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/cocina' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M12 3v18M8 6v5M16 6v5" />
                        <path d="M4 12h16a2 2 0 012 2v2H2v-2a2 2 0 012-2z" />
                    </svg>
                    <span className="text-[10px] font-bold">cocina</span>
                </Link>

            )
        }
        return { hearder, footer }
    }



    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            {/* 1. HEADER - Fijo en la parte superior */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {
                        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
                            <Link to='/' >
                                La Buena Cuchara
                            </Link>
                        </h1>

                    }

                    {/* Menú para desktop */}
                    <nav className="hidden md:flex gap-6">
                        {token && (
                            Links().hearder
                        )
                        }
                    </nav>
                </div>
            </header>


            <main className="flex-1 w-full max-w-7xl mx-auto p-4 pb-24 md:pb-8">
                <Outlet />
            </main>


            {token && (
                <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.03)] pb-safe">
                    {
                        Links().footer
                    }
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
                </nav>
            )}
        </div>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> 3002aa87c52a9a7d0bc3f60f4adf25520aee2559
