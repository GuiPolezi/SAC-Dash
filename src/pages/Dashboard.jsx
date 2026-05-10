// pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { dbService } from '../services/dbService'
import { Link } from 'react-router-dom'

export function Dashboard() {
    const [stats, setStats] = useState({
        totalOcorrencias: 0,
        ocorrenciasAbertas: 0,
        totalClientes: 0,
        totalSuportes: 0
    })
    const [ultimasOcorrencias, setUltimasOcorrencias] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function carregarDados() {
            try {
                const ocorrencias = await dbService.listarOcorrencias()
                const clientes = await dbService.listarClientes()
                const suportes = await dbService.listarSuportes()
                
                setStats({
                    totalOcorrencias: ocorrencias.length,
                    ocorrenciasAbertas: ocorrencias.filter(o => o.status === 'aberto').length,
                    totalClientes: clientes.length,
                    totalSuportes: suportes.length
                })
                
                setUltimasOcorrencias(ocorrencias.slice(0, 5))
            } catch (error) {
                console.error('Erro ao carregar dados:', error)
            } finally {
                setLoading(false)
            }
        }
        carregarDados()
    }, [])

    const cards = [
        { title: 'Total Ocorrências', value: stats.totalOcorrencias, icon: '🎫', color: 'from-blue-500 to-blue-600' },
        { title: 'Ocorrências Abertas', value: stats.ocorrenciasAbertas, icon: '⚠️', color: 'from-yellow-500 to-yellow-600' },
        { title: 'Clientes Ativos', value: stats.totalClientes, icon: '👥', color: 'from-green-500 to-green-600' },
        { title: 'Equipe Suporte', value: stats.totalSuportes, icon: '👨‍💻', color: 'from-purple-500 to-purple-600' },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Bem-vindo ao sistema de gerenciamento de suporte</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className={`bg-gradient-to-r ${card.color} p-4`}>
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">{card.icon}</span>
                                <span className="text-white text-3xl font-bold">{card.value}</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-700 font-medium">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ações rápidas */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/ocorrencias/nova" className="flex items-center justify-center gap-2 bg-[#283618] text-white px-4 py-3 rounded-lg hover:bg-[#3a4d2a] transition-colors">
                        <span>✨</span>
                        <span>Nova Ocorrência</span>
                    </Link>
                    <Link to="/clientes/novo" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        <span>👤</span>
                        <span>Novo Cliente</span>
                    </Link>
                    <Link to="/suportes/novo" className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        <span>👨‍💻</span>
                        <span>Novo Suporte</span>
                    </Link>
                    <Link to="/sistemas/novo" className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
                        <span>💻</span>
                        <span>Novo Sistema</span>
                    </Link>
                </div>
            </div>

            {/* Últimas ocorrências */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Últimas Ocorrências</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ultimasOcorrencias.map((oc) => (
                                <tr key={oc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{oc.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{oc.nome_cliente}</td>
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-2 py-1 text-xs rounded-full font-medium
                                            ${oc.status === 'aberto' ? 'bg-yellow-100 text-yellow-800' : 
                                              oc.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                                              oc.status === 'resolvido' ? 'bg-green-100 text-green-800' :
                                              'bg-gray-100 text-gray-800'}
                                        `}>
                                            {oc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{oc.data_chamado}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/ocorrencias/${oc.id}/editar`} className="text-[#283618] hover:text-[#3a4d2a] font-medium">
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}