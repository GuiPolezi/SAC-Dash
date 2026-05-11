// pages/Clientes.jsx
import { useState, useEffect } from 'react'
import { dbService } from '../services/dbService'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'

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
        { header: 'Data Nascimento', accessor: 'data_nascimento' },
        {
            header: 'Ações',
            cell: (row) => (
                <Link to={`/suportes/${row.codigo_cliente}/editar`} className="text-blue-600 hover:text-blue-800">
                    Editar
                </Link>
            )
        }
    ]

    if (loading) return <div className="text-center py-8">Carregando...</div>

    return (
        <DataTable
            title="Suportes"
            description="Gerencie todos os suportes do sistema"
            data={suporte}
            columns={columns}
            createLink="/suportes/novo"
            createText="Novo Suporte"
        />
    )
}