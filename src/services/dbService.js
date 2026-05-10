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
}
}