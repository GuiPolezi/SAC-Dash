// components/Layout.jsx
import { Link, useLocation } from 'react-router-dom'
import { Logout } from './Logout'

export function Layout({ children }) {
    const location = useLocation()
    
    const navigation = [
        { name: 'Dashboard', href: '/', icon: '📊' },
        { name: 'Ocorrências', href: '/ocorrencias', icon: '🎫' },
        { name: 'Nova Ocorrência', href: '/ocorrencias/nova', icon: '✨' },
        { name: 'Clientes', href: '/clientes', icon: '👥' },
        { name: 'Suportes', href: '/suportes', icon: '👨‍💻' },
        { name: 'Sistemas', href: '/sistemas', icon: '💻' },
        { name: 'Problemas', href: '/problemas', icon: '🐛' },
    ]

    const isActive = (path) => {
        if (path === '/') return location.pathname === path
        return location.pathname.startsWith(path)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar para desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-xl">
                    <div className="flex items-center h-16 flex-shrink-0 px-6 bg-gradient-to-r from-[#283618] to-[#3a4d2a]">
                        <h1 className="text-xl font-bold text-white">Sistema de Suporte</h1>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-4 py-6 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                                        ${isActive(item.href)
                                            ? 'bg-[#283618] text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-[#283618]'
                                        }
                                    `}
                                >
                                    <span className="mr-3 text-xl">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        
                        {/* Área do usuário */}
                        <div className="flex-shrink-0 border-t border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#283618] flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">U</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">Usuário</p>
                                    </div>
                                </div>
                                <Logout />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile header */}
            <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-lg font-bold text-[#283618]">Sistema de Suporte</h1>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                <main className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}