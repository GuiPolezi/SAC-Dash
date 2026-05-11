import { useState } from "react";
import { dbService } from "../services/dbService";
import { Link } from 'react-router-dom' //
import { supabase } from '../services/supabase'; // Importe a instância do supabase para pegar o usuário
import { useNavigate } from "react-router-dom";

export function CriarSistema() {
    const [loading, setLoading] = useState(false)
    const [tipo, setTipo] = useState('')
    const [nome, setNome] = useState('')
    const navigate = useNavigate(); // 🔹 hook para redirecionar
    const handleCriar = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const novoSistema = await dbService.criarSistema(tipo, nome)
            alert(`Sistema "${novoSistema.nome_sistema}" criado com sucesso!`)
            setNome('')
            setTipo('')

            // Aqui eu posso redirecionar o usuario para outra tela
            navigate('/')
        } catch (error) {
            alert("Erro ao criar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        // Fundo da página e centralização (ideal caso seja uma página isolada)
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">

            {/* Card do Formulário */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-fit">

                {/* Cabeçalho */}
                <div className="mb-8 border-b border-gray-100 pb-5">
                    <h2 className="text-3xl font-extrabold text-gray-800">Criar Novo Sistema</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, voluptatum?
                    </p>
                </div>

                <form onSubmit={handleCriar} className="flex flex-col gap-6">

                    {/* Campo: Nome */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nome <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: siscam"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Campo: tipo */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipo sistema <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Web"
                            value={tipo}
                            onChange={e => setTipo(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Rodapé com Botões */}
                    <div className="pt-6 flex justify-end items-center gap-4 mt-2">

                        {/* Botão Cancelar */}
                        <Link
                            to="/"
                            className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </Link>

                        {/* Botão Salvar com Loader */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                            style={{ backgroundColor: '#283618' }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Criando...
                                </span>
                            ) : (
                                'Criar Sistema'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}