import { useState, useEffect } from "react";
import { dbService } from "../services/dbService";
import { Link, useNavigate } from "react-router-dom";
 
export function CriarOcorrencia() {
    const navigate = useNavigate();
 
    // Dados dos selects (carregados do banco)
    const [clientes, setClientes] = useState([]);
    const [suportes, setSuportes] = useState([]);
    const [sistemas, setSistemas] = useState([]);
    const [problemas, setProblemas] = useState([]);
    const [loadingOpcoes, setLoadingOpcoes] = useState(true);
    const [erroOpcoes, setErroOpcoes] = useState(null);
 
    // Campos do formulário
    const [idCliente, setIdCliente] = useState("");
    const [idSuporte, setIdSuporte] = useState("");
    const [idSistema, setIdSistema] = useState("");
    const [idProblema, setIdProblema] = useState("");
    const [dataChamado, setDataChamado] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [dataResposta, setDataResposta] = useState("");
    const [horaInicial, setHoraInicial] = useState("");
    const [horaFinal, setHoraFinal] = useState("");
    const [status, setStatus] = useState("aberto");
 
    const [loading, setLoading] = useState(false);
 
    // Carrega todos os selects em paralelo ao montar o componente
    useEffect(() => {
        async function carregarOpcoes() {
            try {
                const [listClientes, listSuportes, listSistemas, listProblemas] =
                    await Promise.all([
                        dbService.listarClientes(),
                        dbService.listarSuportes(),
                        dbService.listarSistemas(),
                        dbService.listarProblemas(),
                    ]);
                setClientes(listClientes);
                setSuportes(listSuportes);
                setSistemas(listSistemas);
                setProblemas(listProblemas);
            } catch (error) {
                setErroOpcoes("Erro ao carregar opções: " + error.message);
            } finally {
                setLoadingOpcoes(false);
            }
        }
        carregarOpcoes();
    }, []);
 
    const handleCriar = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dbService.criarOcorrencia({
                id_cliente: Number(idCliente),
                id_suporte: idSuporte ? Number(idSuporte) : null,
                id_sistema: Number(idSistema),
                id_problema: Number(idProblema),
                data_chamado: dataChamado,
                data_resposta: dataResposta || null,
                hora_inicial: horaInicial || null,
                hora_final: horaFinal || null,
                status,
            });
            alert("Ocorrência criada com sucesso!");
            navigate("/");
        } catch (error) {
            alert("Erro ao criar ocorrência: " + error.message);
        } finally {
            setLoading(false);
        }
    };
 
    const selectClass =
        "w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:opacity-50";
 
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
 
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-fit">
 
                {/* Cabeçalho */}
                <div className="mb-8 border-b border-gray-100 pb-5">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Nova Ocorrência
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Registre um novo chamado de suporte preenchendo os campos abaixo.
                    </p>
                </div>
 
                {/* Mensagem de erro ao carregar selects */}
                {erroOpcoes && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {erroOpcoes}
                    </div>
                )}
 
                <form onSubmit={handleCriar} className="flex flex-col gap-6">
 
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
                            className={selectClass}
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
                            className={selectClass}
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
                            className={selectClass}
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
 
                    {/* Suporte (opcional) */}
                    <div>
                        <label className={labelClass}>
                            Responsável Suporte{" "}
                            <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <select
                            value={idSuporte}
                            onChange={(e) => setIdSuporte(e.target.value)}
                            disabled={loadingOpcoes}
                            className={selectClass}
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
 
                    {/* Datas */}
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
                                className={selectClass}
                            />
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
                                className={selectClass}
                            />
                        </div>
                    </div>
 
                    {/* Horários */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Hora Inicial</label>
                            <input
                                type="time"
                                value={horaInicial}
                                onChange={(e) => setHoraInicial(e.target.value)}
                                className={selectClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Hora Final</label>
                            <input
                                type="time"
                                value={horaFinal}
                                onChange={(e) => setHoraFinal(e.target.value)}
                                className={selectClass}
                            />
                        </div>
                    </div>
 
                    {/* Status */}
                    <div>
                        <label className={labelClass}>
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className={selectClass}
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
                                    Criando...
                                </span>
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