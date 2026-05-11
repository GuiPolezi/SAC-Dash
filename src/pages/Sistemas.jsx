// pages/Sistemas.jsx
import { useState, useEffect } from 'react'
import { dbService } from '../services/dbService'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'
import { GerarPlanilhaSistemas } from '../components/Planilhas'

export function Sistemas() {
    const [sistema, setSistema] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function carregar() {
            try {
                const dados = await dbService.listarSistemas()
                setSistema(dados)
            } catch (error) {
                console.error('Erro ao carregar:', error)
            } finally {
                setLoading(false)
            }
        }
        carregar()
    }, [])

    const columns = [
        { header: 'Código', accessor: 'codigo_sistema' },
        { header: 'Tipo', accessor: 'tipo' },
        { header: 'Nome', accessor: 'nome_sistema' },
        {
            header: 'Ações',
            cell: (row) => (
                // Correção aplicada: Rota alterada para '/sistemas/' e ID alterado para 'codigo_sistema'
                <Link 
                    to={`/sistemas/${row.codigo_sistema}/editar`} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar
                </Link>
            )
        }
    ]

    // Loading moderno animado
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#283618]"></div>
                <span className="ml-3 text-gray-600 font-medium">Carregando dados...</span>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <DataTable
                title="Sistemas"
                description="Gerencie todos os Sistemas do SAC"
                data={sistema}
                columns={columns}
                createLink="/sistemas/novo"
                createText="Novo Sistema"
                homeLink="/"
                homeText="Voltar"
                actions={<GerarPlanilhaSistemas />}
            />
        </div>
    )
}