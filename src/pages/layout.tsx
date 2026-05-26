import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            
            {/* 1. HEADER - Fijo en la parte superior */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
                        🍽️ La Buena Cuchara
                    </h1>
                    
                    {/* Menú para desktop */}
                    <nav className="hidden md:flex gap-6">
                        {token && (
                            <Link
                                to="/mesero"
                                className={`font-medium transition-colors ${location.pathname === '/mesero' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                            >
                                Mesas
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 pb-24 md:pb-8">
                <Outlet />
            </main>

            
            {token && (
                <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.03)] pb-safe">
                    
                    <Link 
                        to="/mesero" 
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/mesero' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        <span className="text-[10px] font-bold">Mesas</span>
                    </Link>

                    <Link 
                        to="/ordenes" 
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${location.pathname === '/ordenes' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        <span className="text-[10px] font-bold">Órdenes</span>
                    </Link>

                </nav>
            )}
        </div>
    );
}