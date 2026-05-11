import { supabase } from './supabase'



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
      suportes:id_suporte (nome) 
    `) // O formato 'apelido:coluna_fk (campos)' ajuda o Supabase a se achar
    .order("data_chamado", { ascending: false });

  if (error) {
    throw new Error("Erro ao listar ocorrências: " + error.message);
  }

  return data.map(oc => ({
    ...oc,
    nome_cliente: oc.clientes?.nome || "Não informado",
    nome_sistema: oc.sistemas?.nome_sistema || "Não informado",
    nome_suporte: oc.suportes?.nome || "Sem responsável"
  }));
}
}


