// components/DataTable.jsx
import { Link } from 'react-router-dom'

export function DataTable({ title, description, data, columns, createLink, createText, homeLink, homeText }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    {description && <p className="text-gray-600 mt-1">{description}</p>}
                </div>
                {createLink && (
                    <div className='flex gap-2'>
                        <Link
                            to={homeLink}
                            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2'
                        >
                            <span>{homeText}</span>
                        </Link>
                        <Link
                            to={createLink}
                            className="bg-[#283618] text-white px-4 py-2 rounded-lg hover:bg-[#3a4d2a] transition-colors flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>{createText || `Novo ${title}`}</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-900">
                                        {col.cell ? col.cell(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                                    Nenhum registro encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}