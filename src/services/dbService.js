import { supabase } from './supabase'



export const dbService = {

    // Criar suporte
    async criarSuporte(nome, sexo, nascimento) {
        const {data: {user}} = await supabase.auth.getUser()

        const {data, error} = await supabase
        .from('suporte')
        .insert([{
            nome,
            sexo,
            nascimento
        }])
        .select()

        if (error) throw error
        return data[0]
    }
}