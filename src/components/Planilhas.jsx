import { useState } from 'react';
import { dbService } from '../services/dbService'; // Ajuste o caminho se necessário

export function GerarPlanilhaOcorrencias() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportar = async () => {
        try {
            setIsExporting(true); // Desabilita o botão e muda o texto
            await dbService.exportarOcorrenciasParaExcel();
        } catch (err) {
            console.error("Falha na exportação:", err);
            alert("Erro ao gerar planilha. Tente novamente.");
        } finally {
            setIsExporting(false); // Volta o botão ao normal
        }
    };

    return (
        <button
            onClick={handleExportar}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:ring-4
        ${isExporting
                    ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/30'}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {isExporting ? 'Gerando...' : 'Excel'}
        </button>
    );
}


export function GerarPlanilhaProblemas() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportar = async () => {
        try {
            setIsExporting(true);
            await dbService.exportarProblemasParaExcel();
        } catch (erro) {
            console.erro("Falha na exportação: ", erro)
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExportar}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:ring-4
        ${isExporting
                    ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/30'}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {isExporting ? 'Gerando...' : 'Excel'}
        </button>
    )
}


export function GerarPlanilhaClientes() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportar = async () => {
        try {
            setIsExporting(true);
            await dbService.exportarClientesParaExcel();
        } catch (erro) {
            console.erro("Falha na exportação: ", erro)
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExportar}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:ring-4
        ${isExporting
                    ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/30'}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {isExporting ? 'Gerando...' : 'Excel'}
        </button>
    )
}


export function GerarPlanilhaSuportes() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportar = async () => {
        try {
            setIsExporting(true);
            await dbService.exportarSuportesParaExcel();
        } catch (erro) {
            console.erro("Falha na exportação: ", erro)
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExportar}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:ring-4
        ${isExporting
                    ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/30'}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {isExporting ? 'Gerando...' : 'Excel'}
        </button>
    )

}


export function GerarPlanilhaSistemas() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportar = async () => {
        try {
            setIsExporting(true);
            await dbService.exportarSistemasParaExcel();
        } catch (erro) {
            console.erro("Falha na exportação: ", erro)
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExportar}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:ring-4
        ${isExporting
                    ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/30'}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {isExporting ? 'Gerando...' : 'Excel'}
        </button>
    )

}