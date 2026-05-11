// pages/Suportes.jsx
import { useState, useEffect } from 'react'
import { dbService } from '../services/dbService'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'
import { GerarPlanilhaSuportes } from '../components/Planilhas'

export function Suportes() {
    const [suporte, setSuporte] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function carregar() {
            try {
                const dados = await dbService.listarSuportes()
                setSuporte(dados)
            } catch (error) {
                console.error('Erro ao carregar:', error)
            } finally {
                setLoading(false)
            }
        }
        carregar()
    }, [])

    const columns = [
        { header: 'Código', accessor: 'codigo_suporte' },
        { header: 'Nome', accessor: 'nome' },
        { header: 'Sexo', accessor: 'sexo' },
        { 
            header: 'Data Nascimento', 
            // Formata a data para o padrão visual brasileiro na tabela e evita problemas de fuso horário
            cell: (row) => row.data_nascimento 
                ? new Date(row.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                : '-' 
        },
        {
            header: 'Ações',
            cell: (row) => (
                <Link 
                    // Correção aplicada aqui: alterado de codigo_cliente para codigo_suporte
                    to={`/suportes/${row.codigo_suporte}/editar`} 
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
                title="Suportes"
                description="Gerencie todos os suportes do sistema"
                data={suporte}
                columns={columns}
                createLink="/suportes/novo"
                createText="Novo Suporte"
                homeLink="/"
                homeText="Voltar"
                actions={<GerarPlanilhaSuportes />}
            />
        </div>
    )
}