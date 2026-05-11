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

    // Função para estilizar as pílulas de status de forma moderna
    const getStatusStyle = (status) => {
        switch(status) {
            case 'aberto': 
                return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
            case 'em_andamento': 
                return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
            case 'resolvido': 
                return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
            default: 
                return 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20'
        }
    }

    const formatarStatus = (status) => {
        const formatado = status.replace('_', ' ');
        return formatado.charAt(0).toUpperCase() + formatado.slice(1);
    }

    // Configuração dos cards com SVGs ao invés de emojis para um visual profissional
    const cards = [
        { 
            title: 'Total Ocorrências', 
            value: stats.totalOcorrencias, 
            bgIcon: 'bg-indigo-50', 
            colorIcon: 'text-indigo-600',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        { 
            title: 'Ocorrências Abertas', 
            value: stats.ocorrenciasAbertas, 
            bgIcon: 'bg-amber-50', 
            colorIcon: 'text-amber-600',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        { 
            title: 'Clientes Ativos', 
            value: stats.totalClientes, 
            bgIcon: 'bg-emerald-50', 
            colorIcon: 'text-emerald-600',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        { 
            title: 'Equipe Suporte', 
            value: stats.totalSuportes, 
            bgIcon: 'bg-[#283618]/10', 
            colorIcon: 'text-[#283618]',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
    ]

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#283618]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header Moderno */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Geral</h1>
                    <p className="text-sm text-gray-500 mt-1">Acompanhe as métricas e chamados do seu HelpDesk.</p>
                </div>
                <div>
                    <Link to="/ocorrencias/nova" className="inline-flex items-center justify-center gap-2 bg-[#283618] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1f2a12] transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Chamado
                    </Link>
                </div>
            </div>

            {/* Cards de Estatísticas (Minimalistas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow duration-200">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${card.bgIcon} ${card.colorIcon}`}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Ações Rápidas (Estilo Tiles) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">Acesso Rápido</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <Link to="/clientes/novo" className="group flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#283618]/30 hover:shadow-md transition-all">
                            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg mr-4 group-hover:bg-blue-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">Novo Cliente</span>
                        </Link>

                        <Link to="/suportes/novo" className="group flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#283618]/30 hover:shadow-md transition-all">
                            <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg mr-4 group-hover:bg-purple-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">Novo Suporte</span>
                        </Link>

                        <Link to="/sistemas/novo" className="group flex items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#283618]/30 hover:shadow-md transition-all">
                            <div className="bg-green-50 text-green-600 p-2.5 rounded-lg mr-4 group-hover:bg-green-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">Novo Sistema</span>
                        </Link>
                    </div>
                </div>

                {/* Tabela de Últimas Ocorrências */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Últimos Chamados</h2>
                        <Link to="/ocorrencias" className="text-sm font-medium text-[#283618] hover:text-[#1f2a12] hover:underline">
                            Ver todos &rarr;
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {ultimasOcorrencias.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                Nenhuma ocorrência registrada recentemente.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ultimasOcorrencias.map((oc) => (
                                            <tr key={oc.id} className="hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    #{oc.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                    {oc.nome_cliente}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusStyle(oc.status)}`}>
                                                        {formatarStatus(oc.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {oc.data_chamado.split('-').reverse().join('/')} {/* Formata YYYY-MM-DD para DD/MM/YYYY */}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right">
                                                    <Link to={`/ocorrencias/${oc.id}/editar`} className="text-[#283618] hover:text-[#1f2a12] font-medium inline-flex items-center gap-1 transition-colors">
                                                        Abrir
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}