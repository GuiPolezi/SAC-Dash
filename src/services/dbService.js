import { supabase } from './supabase'
import * as XLSX from 'xlsx';


export const dbService = {

    // Criar suporte
    async criarSuporte(nome, sexo, data_nascimento) {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Usuário não autenticado. Faça login antes de inserir.')
        }

        const { data, error } = await supabase
            .from('suporte')
            .insert([{ nome, sexo, data_nascimento }])
            .select()

        if (error) throw error
        return data[0]
    },

    // Criar sistema
    async criarSistema(tipo, nome_sistema) {
        const { data, error } = await supabase
            .from('sistemas')
            .insert([{ tipo, nome_sistema }])
            .select()
        if (error) throw error
        return data[0]
    },

    // Criar Cliente
    async criarCliente(nome, cidade, data_inscrição) {
        const { data, error } = await supabase
            .from('clientes')
            .insert([{ nome, cidade }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Criar Registro de Problema
    async criarProblema(problema) {
        const { data, error } = await supabase
            .from('problemas')
            .insert([{ problema }])
            .select()
            .single()


        if (error) throw error
        return data
    },

    // CRIAÇÕES PARA OCORRENCIAS
    // ─── LISTAR (para popular os <select> do formulário) ───────────────────────

    // Listar todos os clientes
    async listarClientes() {
        const { data, error } = await supabase
            .from('clientes')
            .select('codigo_cliente, nome, cidade, data_inscricao')
            .order('nome')

        if (error) throw error
        return data
    },

    // Listar todos os usuários de suporte
    async listarSuportes() {
        const { data, error } = await supabase
            .from('suporte')
            .select('codigo_suporte, nome, sexo, data_nascimento')
            .order('nome')

        if (error) throw error
        return data
    },

    // Listar todos os sistemas
    async listarSistemas() {
        const { data, error } = await supabase
            .from('sistemas')
            .select('codigo_sistema, nome_sistema, tipo')
            .order('nome_sistema')

        if (error) throw error
        return data
    },

    // Listar todos os problemas
    async listarProblemas() {
        const { data, error } = await supabase
            .from('problemas')
            .select('codigo_problema, problema')
            .order('problema')

        if (error) throw error
        return data
    },


    // ─── CRIAR OCORRÊNCIA ──────────────────────────────────────────────────────

    async criarOcorrencia({
        id_cliente,
        id_suporte,   // pode ser null
        id_sistema,
        id_problema,
        data_chamado,
        data_resposta,  // pode ser null
        hora_inicial,   // pode ser null
        hora_final,     // pode ser null
        status = 'aberto',
    }) {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Usuário não autenticado. Faça login antes de inserir.')
        }

        const { data, error } = await supabase
            .from('ocorrencias')
            .insert([{
                id_cliente,
                id_suporte,
                id_sistema,
                id_problema,
                data_chamado,
                data_resposta,
                hora_inicial,
                hora_final,
                status,
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Adicione estas duas funções ao seu objeto dbService em dbService.js

    // Buscar uma ocorrência por ID (usado para preencher o formulário de edição)
    async buscarOcorrencia(id) {
        const { data, error } = await supabase
            .from('ocorrencias')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Editar uma ocorrência existente
    async editarOcorrencia(id, campos) {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Usuário não autenticado. Faça login antes de editar.')
        }

        const { data, error } = await supabase
            .from('ocorrencias')
            .update(campos)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },


    async listarOcorrencias() {
        const { data, error } = await supabase
            .from("ocorrencias")
            .select(`
      *,
      clientes:id_cliente (nome),
      sistemas:id_sistema (nome_sistema),
      suportes:id_suporte (nome),
      problemas:id_problema (problema)
    `) // O formato 'apelido:coluna_fk (campos)' ajuda o Supabase a se achar
            .order("data_chamado", { ascending: false });

        if (error) {
            throw new Error("Erro ao listar ocorrências: " + error.message);
        }

        return data.map(oc => ({
            ...oc,
            nome_cliente: oc.clientes?.nome || "Não informado",
            nome_sistema: oc.sistemas?.nome_sistema || "Não informado",
            nome_suporte: oc.suportes?.nome || "Sem responsável",
            nome_problema: oc.problemas?.problema || "Sem Problema",
        }));
    },


    // FUNÇÕES DE EXPORTAR TABELA
    async exportarOcorrenciasParaExcel() {
        try {
            // 1. Busca os dados (reutilizando sua função existente)
            const dados = await this.listarOcorrencias();

            if (!dados || dados.length === 0) {
                alert("Não há dados para exportar.");
                return;
            }

            // 2. Formata os dados para a planilha (removendo o que não precisa ou renomeando colunas)
            const dadosFormatados = dados.map(oc => ({
                "ID": oc.id,
                // Correção aqui: Adicionando { timeZone: 'UTC' }
                "Data do Chamado": new Date(oc.data_chamado).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
                "Cliente": oc.nome_cliente,
                "Sistema": oc.nome_sistema,
                "Problema": oc.nome_problema,
                "Suporte": oc.nome_suporte,
                "Status": oc.status.toUpperCase(),
                "Hora Inicial": oc.hora_inicial,
                "Hora Final": oc.hora_final,
                // Correção aqui também para a data de resposta
                "Data Resposta": oc.data_resposta 
                    ? new Date(oc.data_resposta).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                    : "-"
            }));

            // 3. Cria a planilha
            const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Ocorrências");

            // 4. Gera o arquivo e inicia o download
            XLSX.writeFile(workbook, `fOcorrencias_${new Date().getTime()}.xlsx`);

        } catch (error) {
            console.error("Erro ao exportar Excel:", error);
            throw error;
        }
    },

    async exportarProblemasParaExcel() {
        try {
            const dados = await this.listarProblemas();

            if (!dados || dados.length === 0) {
                alert("Não há dados para exportar.");
                return;
            }

             const dadosFormatados = dados.map(oc => ({
                "codigo_problema": oc.codigo_problema,
                "Problema": oc.problema,
            }));

            // Cria a planilha
            const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Problemas");

            XLSX.writeFile(workbook, `dProblemas_${new Date().getTime()}.xlsx`);
        } catch (error) {
            console.error("Erro ao exportar Excel: ", error)
            throw error;
        }
    },

    async exportarClientesParaExcel() {
        try {
            const dados = await this.listarClientes();

            if (!dados || dados.length === 0) {
                alert("Não há dados para exportar.");
                return;
            }

             const dadosFormatados = dados.map(oc => ({
                "codigo_cliente": oc.codigo_cliente,
                "Nome": oc.nome,
                "Cidade": oc.cidade,
                "Data Inscrição": oc.data_inscricao
            }));

            // Cria a planilha
            const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

            XLSX.writeFile(workbook, `dClientes_${new Date().getTime()}.xlsx`);
        } catch (error) {
            console.error("Erro ao exportar Excel: ", error)
            throw error;
        }
    },

    async exportarSuportesParaExcel() {
        try {
            const dados = await this.listarSuportes();

            if (!dados || dados.length === 0) {
                alert("Não há dados para exportar.");
                return;
            }

             const dadosFormatados = dados.map(oc => ({
                "codigo_suporte": oc.codigo_suporte,
                "Nome": oc.nome,
                "Sexo": oc.sexo,
                "Data Nascimento": oc.data_nascimento
            }));

            // Cria a planilha
            const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Suportes");

            XLSX.writeFile(workbook, `dSuportes_${new Date().getTime()}.xlsx`);
        } catch (error) {
            console.error("Erro ao exportar Excel: ", error)
            throw error;
        }
    },

    async exportarSistemasParaExcel() {
        try {
            const dados = await this.listarSistemas();

            if (!dados || dados.length === 0) {
                alert("Não há dados para exportar.");
                return;
            }

             const dadosFormatados = dados.map(oc => ({
                "codigo_sistema": oc.codigo_sistema,
                "Tipo": oc.tipo,
                "Nome": oc.nome,
            }));

            // Cria a planilha
            const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sistemas");

            XLSX.writeFile(workbook, `dSistemas_${new Date().getTime()}.xlsx`);
        } catch (error) {
            console.error("Erro ao exportar Excel: ", error)
            throw error;
        }
    },
}


