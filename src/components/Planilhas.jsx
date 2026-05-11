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
            className="btn-excel"
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
        >
            {isExporting ? 'Gerando Planilha...' : 'Exportar para Excel'}
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
            className="btn-excel"
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
        >
            {isExporting ? 'Gerando Planilha...' : 'Exportar para Excel'}
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
            className="btn-excel"
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
        >
            {isExporting ? 'Gerando Planilha...' : 'Exportar para Excel'}
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
            className="btn-excel"
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
        >
            {isExporting ? 'Gerando Planilha...' : 'Exportar para Excel'}
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
            className="btn-excel"
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.7 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
        >
            {isExporting ? 'Gerando Planilha...' : 'Exportar para Excel'}
        </button>
    )
    
}