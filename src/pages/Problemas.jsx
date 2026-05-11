// pages/Problemas.jsx
import { useState, useEffect } from 'react'
import { dbService } from '../services/dbService'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'

export function Problemas() {
    const [problemas, setProblemas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function carregar() {
            try {
                const dados = await dbService.listarProblemas()
                setProblemas(dados)
            } catch (error) {
                console.error('Erro ao carregar:', error)
            } finally {
                setLoading(false)
            }
        }
        carregar()
    }, [])

    const columns = [
        { header: 'Código', accessor: 'codigo_problema' },
        { header: 'Tipo de Problema', accessor: 'problema' },
        {
            header: 'Ações',
            cell: (row) => (
                <Link to={`/problemas/${row.codigo_cliente}/editar`} className="text-blue-600 hover:text-blue-800">
                    Editar
                </Link>
            )
        }
    ]

    if (loading) return <div className="text-center py-8">Carregando...</div>

    return (
        <DataTable
            title="Problemas"
            description="Gerencie todos os Problemas do sistema"
            data={problemas}
            columns={columns}
            createLink="/problemas/novo"
            createText="Novo Problema"
        />
    )
}