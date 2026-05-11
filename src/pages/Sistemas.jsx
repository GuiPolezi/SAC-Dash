// pages/Suportes.jsx
import { useState, useEffect } from 'react'
import { dbService } from '../services/dbService'
import { DataTable } from '../components/DataTable'
import { Link } from 'react-router-dom'


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
                <Link to={`/suportes/${row.codigo_cliente}/editar`} className="text-blue-600 hover:text-blue-800">
                    Editar
                </Link>
            )
        }
    ]

    if (loading) return <div className="text-center py-8">Carregando...</div>

    return (
        <DataTable
            title="Sistemas"
            description="Gerencie todos os Sistemas do SAC"
            data={sistema}
            columns={columns}
            createLink="/sistemas/novo"
            createText="Novo Sistema"
            homeLink="/"
            homeText="Voltar"
        />
    )
}