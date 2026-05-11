import { useState, useEffect } from "react";
import { dbService } from "../services/dbService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GerarPlanilhaOcorrencias } from "./Planilhas";


/**
 * Componente unificado de criação e edição de ocorrência.
 *
 * Rotas sugeridas:
 *   /ocorrencias/nova          → modo criação
 *   /ocorrencias/:id/editar    → modo edição
 */
export function OcorrenciaForm() {
    const { id } = useParams();          // undefined na criação, número na edição
    const modoEdicao = Boolean(id);
    const navigate = useNavigate();

    // ── Opções dos selects ───────────────────────────────────────────────────
    const [clientes, setClientes] = useState([]);
    const [suportes, setSuportes] = useState([]);
    const [sistemas, setSistemas] = useState([]);
    const [problemas, setProblemas] = useState([]);
    const [loadingOpcoes, setLoadingOpcoes] = useState(true);
    const [erroOpcoes, setErroOpcoes] = useState(null);

    // ── Campos do formulário ─────────────────────────────────────────────────
    const [idCliente, setIdCliente] = useState("");
    const [idSuporte, setIdSuporte] = useState("");
    const [idSistema, setIdSistema] = useState("");
    const [idProblema, setIdProblema] = useState("");
    const [dataChamado, setDataChamado] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [horaInicial, setHoraInicial] = useState("");
    const [status, setStatus] = useState("aberto");

    // Campos exclusivos da edição
    const [dataResposta, setDataResposta] = useState("");
    const [horaFinal, setHoraFinal] = useState("");

    const [loading, setLoading] = useState(false);

    // ── Carrega selects (+ ocorrência existente no modo edição) ─────────────
    useEffect(() => {
        async function inicializar() {
            try {
                // Carrega todas as listas em paralelo, e se for edição busca
                // a ocorrência também na mesma Promise.all
                const promessas = [
                    dbService.listarClientes(),
                    dbService.listarSuportes(),
                    dbService.listarSistemas(),
                    dbService.listarProblemas(),
                ];

                if (modoEdicao) {
                    promessas.push(dbService.buscarOcorrencia(id));
                }

                const resultados = await Promise.all(promessas);

                setClientes(resultados[0]);
                setSuportes(resultados[1]);
                setSistemas(resultados[2]);
                setProblemas(resultados[3]);

                // Preenche os campos com os dados existentes
                if (modoEdicao) {
                    const oc = resultados[4];
                    setIdCliente(String(oc.id_cliente));
                    setIdSuporte(oc.id_suporte ? String(oc.id_suporte) : "");
                    setIdSistema(String(oc.id_sistema));
                    setIdProblema(String(oc.id_problema));
                    setDataChamado(oc.data_chamado ?? "");
                    setHoraInicial(oc.hora_inicial ?? "");
                    setStatus(oc.status ?? "aberto");
                    setDataResposta(oc.data_resposta ?? "");
                    setHoraFinal(oc.hora_final ?? "");
                }
            } catch (error) {
                setErroOpcoes("Erro ao carregar dados: " + error.message);
            } finally {
                setLoadingOpcoes(false);
            }
        }

        inicializar();
    }, [id, modoEdicao]);

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            id_cliente: Number(idCliente),
            id_suporte: idSuporte ? Number(idSuporte) : null,
            id_sistema: Number(idSistema),
            id_problema: Number(idProblema),
            data_chamado: dataChamado,
            hora_inicial: horaInicial || null,
            status,
            // Campos exclusivos da edição
            ...(modoEdicao && {
                data_resposta: dataResposta || null,
                hora_final: horaFinal || null,
            }),
        };

        try {
            if (modoEdicao) {
                await dbService.editarOcorrencia(id, payload);
                alert("Ocorrência atualizada com sucesso!");
            } else {
                await dbService.criarOcorrencia(payload);
                alert("Ocorrência criada com sucesso!");
            }
            navigate("/");
        } catch (error) {
            alert("Erro ao salvar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Estilos reutilizáveis ────────────────────────────────────────────────
    const inputClass =
        "w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:opacity-50";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-fit">

                {/* Cabeçalho */}
                <div className="mb-8 border-b border-gray-100 pb-5">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        {modoEdicao ? "Editar Ocorrência" : "Nova Ocorrência"}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        {modoEdicao
                            ? "Atualize os dados do chamado abaixo."
                            : "Registre um novo chamado de suporte preenchendo os campos abaixo."}
                    </p>
                </div>

                {/* Erro ao carregar */}
                {erroOpcoes && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {erroOpcoes}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Cliente */}
                    <div>
                        <label className={labelClass}>
                            Cliente <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={idCliente}
                            onChange={(e) => setIdCliente(e.target.value)}
                            required
                            disabled={loadingOpcoes}
                            className={inputClass}
                        >
                            <option value="">
                                {loadingOpcoes ? "Carregando..." : "Selecione um cliente"}
                            </option>
                            {clientes.map((c) => (
                                <option key={c.codigo_cliente} value={c.codigo_cliente}>
                                    {c.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sistema */}
                    <div>
                        <label className={labelClass}>
                            Sistema <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={idSistema}
                            onChange={(e) => setIdSistema(e.target.value)}
                            required
                            disabled={loadingOpcoes}
                            className={inputClass}
                        >
                            <option value="">
                                {loadingOpcoes ? "Carregando..." : "Selecione um sistema"}
                            </option>
                            {sistemas.map((s) => (
                                <option key={s.codigo_sistema} value={s.codigo_sistema}>
                                    {s.nome_sistema} — {s.tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Problema */}
                    <div>
                        <label className={labelClass}>
                            Problema <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={idProblema}
                            onChange={(e) => setIdProblema(e.target.value)}
                            required
                            disabled={loadingOpcoes}
                            className={inputClass}
                        >
                            <option value="">
                                {loadingOpcoes ? "Carregando..." : "Selecione um problema"}
                            </option>
                            {problemas.map((p) => (
                                <option key={p.codigo_problema} value={p.codigo_problema}>
                                    {p.problema}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Suporte */}
                    <div>
                        <label className={labelClass}>
                            Responsável Suporte{" "}
                            <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <select
                            value={idSuporte}
                            onChange={(e) => setIdSuporte(e.target.value)}
                            disabled={loadingOpcoes}
                            className={inputClass}
                        >
                            <option value="">
                                {loadingOpcoes ? "Carregando..." : "Sem responsável definido"}
                            </option>
                            {suportes.map((s) => (
                                <option key={s.codigo_suporte} value={s.codigo_suporte}>
                                    {s.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Data do chamado + Hora inicial */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                Data do Chamado <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={dataChamado}
                                onChange={(e) => setDataChamado(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Hora Inicial{" "}
                                <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <input
                                type="time"
                                value={horaInicial}
                                onChange={(e) => setHoraInicial(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* ── Campos exclusivos da edição ── */}
                    {modoEdicao && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="sm:col-span-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                    Resolução
                                </p>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Data de Resposta{" "}
                                    <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <input
                                    type="date"
                                    value={dataResposta}
                                    onChange={(e) => setDataResposta(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Hora Final{" "}
                                    <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <input
                                    type="time"
                                    value={horaFinal}
                                    onChange={(e) => setHoraFinal(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className={labelClass}>
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className={inputClass}
                        >
                            <option value="aberto">Aberto</option>
                            <option value="em_andamento">Em andamento</option>
                            <option value="resolvido">Resolvido</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>

                    {/* Rodapé */}
                    <div className="pt-6 flex justify-end items-center gap-4 mt-2">
                        <Link
                            to="/"
                            className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={loading || loadingOpcoes}
                            className="text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                            style={{ backgroundColor: "#283618" }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {modoEdicao ? "Salvando..." : "Criando..."}
                                </span>
                            ) : modoEdicao ? (
                                "Salvar Alterações"
                            ) : (
                                "Criar Ocorrência"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    
}



export function OcorrenciaLista() {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Configura a data atual (YYYY-MM-DD) considerando o fuso horário local
    const hoje = new Date();
    const dataAtualLocal = new Date(hoje.getTime() - (hoje.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const [dataFiltro, setDataFiltro] = useState(dataAtualLocal);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const dados = await dbService.listarOcorrencias();
            setOcorrencias(dados);
        } catch (error) {
            console.error('Erro ao carregar:', error);
        } finally {
            setLoading(false);
        }
    }

    // 1. Filtra os chamados apenas para o dia selecionado
    // 2. Ordena cronologicamente pela hora_inicial (se houver)
    const chamadosDoDia = ocorrencias
        .filter(oc => {
            if (!oc.data_chamado) return false;
            const dataOc = oc.data_chamado.split('T')[0];
            return dataOc === dataFiltro;
        })
        .sort((a, b) => {
            const horaA = a.hora_inicial || '99:99'; // Joga os sem hora para o final
            const horaB = b.hora_inicial || '99:99';
            return horaA.localeCompare(horaB);
        });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#283618]"></div>
                <span className="ml-3 text-gray-600 font-medium">Carregando chamados...</span>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
            
            {/* Cabeçalho e Filtros */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agenda de Chamados</h1>
                    <p className="text-gray-500 mt-1">Visualize e gerencie os atendimentos diários</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Filtro de Data */}
                    <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#283618] focus-within:border-transparent transition-all">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <input 
                            type="date" 
                            value={dataFiltro}
                            onChange={(e) => setDataFiltro(e.target.value)}
                            className="bg-transparent text-gray-700 font-medium outline-none cursor-pointer"
                        />
                    </div>

                    <div className="h-8 w-px bg-gray-200 hidden md:block mx-1"></div>

                    <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 font-medium transition-colors">
                        Voltar
                    </Link>
                    <GerarPlanilhaOcorrencias />
                    <Link to="/ocorrencias/nova" className="flex items-center gap-2 bg-[#283618] text-white px-5 py-2.5 rounded-lg hover:bg-[#1a2410] transition-colors shadow-sm font-medium">
                        <span>+ Novo Chamado</span>
                    </Link>
                </div>
            </div>

            {/* Lista Diária de Chamados */}
            <div className="space-y-3">
                {chamadosDoDia.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <h3 className="text-lg font-medium text-gray-900">Nenhum chamado para este dia</h3>
                        <p className="text-gray-500 mt-1">Selecione outra data ou crie um novo registro.</p>
                    </div>
                ) : (
                    chamadosDoDia.map((oc) => (
                        <div 
                            key={oc.id} 
                            className="group flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#283618]/30 transition-all overflow-hidden relative"
                        >
                            {/* Barra lateral de cor (indicador de status visual) */}
                            <div className={`w-1.5 md:w-2 shrink-0 ${oc.status === 'aberto' ? 'bg-amber-400' : oc.status === 'concluido' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                            
                            <div className="flex flex-1 flex-col md:flex-row items-start md:items-center p-4 md:p-5 gap-4 md:gap-6">
                                
                                {/* Bloco de Horário */}
                                <div className="flex flex-col min-w-[80px]">
                                    <span className="text-xl font-bold text-gray-800 tracking-tight">
                                        {oc.hora_inicial ? oc.hora_inicial.substring(0, 5) : '--:--'}
                                    </span>
                                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">#{oc.id}</span>
                                </div>

                                {/* Bloco de Informações Principais */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">{oc.nome_cliente}</h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                                            {oc.nome_sistema}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 line-clamp-2 md:line-clamp-1 text-sm md:text-base leading-relaxed">
                                        {oc.nome_problema}
                                    </p>
                                </div>

                                {/* Bloco de Responsável e Status */}
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 md:gap-2">
                                    <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {oc.nome_suporte || 'Sem Suporte'}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
                                        oc.status === 'aberto' ? 'bg-amber-100 text-amber-800' : 
                                        oc.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' : 
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {oc.status}
                                    </span>
                                </div>

                                {/* Botão Editar (Aparece no hover em Desktop) */}
                                <div className="hidden md:flex ml-2">
                                    <Link 
                                        to={`/ocorrencias/${oc.id}/editar`}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Editar Chamado"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </Link>
                                </div>
                                {/* Botão Editar para Mobile (Sempre visível) */}
                                <div className="w-full md:hidden pt-3 mt-1 border-t border-gray-100">
                                    <Link 
                                        to={`/ocorrencias/${oc.id}/editar`}
                                        className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
                                    >
                                        Editar Chamado
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}