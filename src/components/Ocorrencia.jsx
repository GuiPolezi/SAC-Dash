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

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await dbService.listarOcorrencias();
        setOcorrencias(dados);
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) return <div className="p-8">Carregando chamados...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chamados de Suporte</h1>
        <div className="flex gap-5">
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                Voltar
            </Link>
            <Link 
            to="/ocorrencias/nova" 
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
            >
            Novo Chamado
            </Link>
            <GerarPlanilhaOcorrencias />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Suporte</th>
              <th className="p-4">Sistema</th>
              <th className="p-4">Problema</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ocorrencias.map((oc) => (
              <tr key={oc.id} className="border-b hover:bg-gray-50">
                <td className="p-4">#{oc.id}</td>
                <td className="p-4">{oc.nome_cliente}</td>
                <td className="p-4">{oc.nome_suporte}</td>
                <td className="p-4">{oc.nome_sistema}</td>
                <td className="p-4">{oc.nome_problema}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    oc.status === 'aberto' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {oc.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {/* AQUI ESTÁ O BOTÃO DE EDIÇÃO */}
                  <Link 
                    to={`/ocorrencias/${oc.id}/editar`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-900 font-medium"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}