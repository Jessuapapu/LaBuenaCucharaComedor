import { useState } from 'react';
import { ArrowLeft, Lock, CreditCard, Loader2, Eye, Undo2, MonitorSpeaker } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCaja, apiCaja } from '../../hooks/caja';
import { ModalCobro } from './modals/ModalCobro';
import { ModalReembolso } from './modals/ModalReembolso';
import { ModalAdministrarCaja } from './modals/ModalAdministrarCaja';
import { ModalAutorizacionAdmin } from './modals/ModalAutorizacionAdmin'

export default function Caja() {
    // Ya no extraemos abrirCaja ni cerrarCaja
    const { estadoCaja, datosCaja, cargando, refetch } = useCaja();
    
    // Estados para Modales
    const [ordenACobrar, setOrdenACobrar] = useState<any | null>(null);
    const [ordenAAdministrar, setOrdenAAdministrar] = useState<any | null>(null);
    
    // Estados para el flujo de Reembolso Seguro
    const [ordenAAutorizar, setOrdenAAutorizar] = useState<any | null>(null); // Paso 1: Pedir credenciales
    const [ordenAReembolsar, setOrdenAReembolsar] = useState<any | null>(null); // Paso 2: Ejecutar reembolso

    const procesarPagosMultiples = async (idOrden: number, pagos: any[]): Promise<boolean> => {
        try {
            for (const pago of pagos) {
                await apiCaja.pagarOrden({ IdOrden: idOrden, Monto: pago.monto, Metodo: pago.metodo, Referencia: pago.referencia || "" });
            }
            await apiCaja.finalizarOrden(idOrden);
            refetch(); 
            return true;
        } catch (error) {
            console.error(error);
            alert("Error al procesar el pago.");
            return false;
        }
    };

    if (cargando) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-sky-500" size={48}/>
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500 animate-pulse">Sincronizando Terminal...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Link
                to="/mesero"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#9DA968]/40 bg-[#FFF8E7] px-4 py-2.5 font-bold text-[#14502E] shadow-sm transition hover:bg-white hover:shadow-md"
            >
                <ArrowLeft size={18} aria-hidden="true" />
                Volver a mesas
            </Link>
            
            {/* ENCABEZADO PRINCIPAL */}
            <div className="bg-white-800 backdrop-blur-md p-6 rounded-xl border border-slate-200/60 shadow-sm shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl shadow-lg border ${estadoCaja ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500/30 text-white shadow-emerald-500/20' : 'bg-gradient-to-br from-rose-500 to-red-600 border-rose-500/30 text-white shadow-rose-500/20'}`}>
                        {estadoCaja ? <MonitorSpeaker size={28} /> : <Lock size={28} />}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Terminal de Caja</h1>
                        <p className="text-sm font-bold tracking-widest uppercase mt-1 flex items-center gap-2 text-slate-500">
                            Estado actual: 
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] text-white ${estadoCaja ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-rose-500 shadow-sm shadow-rose-500/30'}`}>
                                {estadoCaja ? 'OPERATIVA' : 'CERRADA'}
                            </span>
                        </p>
                    </div>
                </div>
                {/* BOTÓN DE ABRIR/CERRAR ELIMINADO DE AQUÍ */}
            </div>

            {!estadoCaja ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white-800 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl">
                    <div className="p-6 bg-slate-100 rounded-full border border-slate-200 shadow-inner mb-6">
                        <Lock size={48} className="text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">Terminal Cerrada</h2>
                    <p className="text-slate-500 font-medium mt-2 text-lg">Contacte a un administrador para aperturar la caja de este turno.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
                    
                    {/* PANEL IZQUIERDO: ACTIVAS */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col relative overflow-hidden">
                        {/* ... (Todo el contenido de órdenes activas se mantiene idéntico) ... */}
                    </div>

                    {/* PANEL DERECHO: ATENDIDAS */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col relative overflow-hidden">
                        {/* ... (Encabezado de atendidas) ... */}
                        
                        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                            {datosCaja?.OrdenesAtendidas?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500/60 font-medium">
                                    <CreditCard size={56} className="mb-4 text-slate-700"/>
                                    <p>Sin transacciones completadas</p>
                                </div>
                            ) : (
                                datosCaja?.OrdenesAtendidas?.map((orden: any) => (
                                    <div key={orden.IdOrden} className="bg-slate-950/20 border border-slate-800/50 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-800/40 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="flex gap-1 border-r border-slate-800/60 pr-3">
                                                <button onClick={() => setOrdenAAdministrar(orden)} className="p-2 text-slate-500 hover:text-sky-400 bg-slate-900/40 hover:bg-slate-800 rounded-lg transition-colors" title="Ver Detalles">
                                                    <Eye size={18}/>
                                                </button>
                                                {/* CAMBIO AQUÍ: En lugar de setOrdenAReembolsar, disparamos la autorización */}
                                                <button onClick={() => setOrdenAAutorizar(orden)} className="p-2 text-slate-500 hover:text-rose-400 bg-slate-900/40 hover:bg-slate-800 rounded-lg transition-colors" title="Emitir Reembolso (Requiere Admin)">
                                                    <Undo2 size={18}/>
                                                </button>
                                            </div>
                                            <div>
                                                <div className="font-mono font-black text-slate-200">Ord #{orden.IdOrden}</div>
                                                <div className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mt-0.5">Pagado</div>
                                            </div>
                                        </div>
                                        <div className="font-mono font-black text-emerald-400 text-lg">C${orden.Monto.toFixed(2)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* ... (Footer del panel derecho) ... */}
                    </div>
                </div>
            )}

            {/* ZONA DE MODALES */}
            {ordenACobrar && <ModalCobro orden={ordenACobrar} onClose={() => setOrdenACobrar(null)} onConfirmarPagos={procesarPagosMultiples} />}
            {ordenAAdministrar && <ModalAdministrarCaja orden={ordenAAdministrar} onClose={() => setOrdenAAdministrar(null)} onSuccess={refetch} />}
            
            {/* FLUJO DE REEMBOLSO DE 2 PASOS */}
            {/* Paso 1: Pedir autorización al Admin */}
            {ordenAAutorizar && (
                <ModalAutorizacionAdmin 
                    onClose={() => setOrdenAAutorizar(null)} 
                    onSuccess={() => {
                        setOrdenAReembolsar(ordenAAutorizar); // Si es exitoso, pasamos la orden al estado final
                        setOrdenAAutorizar(null); // Cerramos el modal de auth
                    }} 
                />
            )}
            
            {/* Paso 2: El modal real de reembolso */}
            {ordenAReembolsar && (
                <ModalReembolso 
                    orden={ordenAReembolsar} 
                    onClose={() => setOrdenAReembolsar(null)} 
                    onSuccess={refetch} 
                />
            )}
        </div>
    );
}
