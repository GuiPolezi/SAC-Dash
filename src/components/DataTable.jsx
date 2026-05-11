// components/DataTable.jsx
import { Link } from 'react-router-dom'

export function DataTable({ title, description, data, columns, createLink, createText, homeLink, homeText, actions }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
                
                {/* Botões - Envolvemos em flex-wrap para telas menores */}
                <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
                    {homeLink && (
                        <Link
                            to={homeLink}
                            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all'
                        >
                            {/* Ícone de Voltar (Seta) */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>{homeText}</span>
                        </Link>
                    )}
                    
                    {/* Ações Extras (Botão Excel entrará aqui) */}
                    {actions}

                    {createLink && (
                        <Link
                            to={createLink}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#283618] rounded-lg hover:bg-[#1f2a13] shadow-sm focus:ring-4 focus:ring-[#283618]/30 transition-all"
                        >
                            {/* Ícone de Mais (+) */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>{createText || `Novo ${title}`}</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50/80 transition-colors duration-150">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                        {col.cell ? col.cell(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-base font-medium">Nenhum registro encontrado</p>
                                        <p className="text-sm mt-1">Comece adicionando um novo item.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}