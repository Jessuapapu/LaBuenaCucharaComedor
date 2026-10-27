import { useState } from 'react';
import { Lock, X, Loader2 } from 'lucide-react';
// Importa tu función de login/auth aquí
// import { apiAuth } from '../../../hooks/auth'; 

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export function ModalAutorizacionAdmin({ onClose, onSuccess }: Props) {
    const [password, setPassword] = useState('');
    const [usuarioAdmin, setUsuarioAdmin] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const handleAutorizar = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        try {
            // AQUÍ CONECTAS CON TU BACKEND. Ejemplo:
            // const esValido = await apiAuth.verificarCredencialesAdmin(usuarioAdmin, password);
            // Si tu backend devuelve un token o true:
            
            // Simulación de delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Simulación de validación (Reemplazar con lógica real)
            if (usuarioAdmin === 'admin' && password === '123') {
                onSuccess(); // Dispara la apertura del Modal de Reembolso
            } else {
                setError('Credenciales incorrectas o no tiene permisos de administrador.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <div className="flex flex-col items-center justify-center text-center mb-6">
                        <div className="bg-rose-100 text-rose-600 p-4 rounded-full mb-4">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">Autorización Requerida</h2>
                        <p className="text-slate-500 mt-2">Un administrador debe autorizar el reembolso para continuar con esta operación.</p>
                    </div>

                    <form onSubmit={handleAutorizar} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Usuario Administrador</label>
                            <input 
                                type="text"
                                value={usuarioAdmin}
                                onChange={(e) => setUsuarioAdmin(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none"
                                placeholder="Ej. admin"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-3 rounded-lg border border-rose-100">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={cargando}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {cargando ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
                            {cargando ? 'Verificando...' : 'Autorizar Reembolso'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}