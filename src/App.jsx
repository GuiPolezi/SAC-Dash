import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'
import AppRoutes from './routes'

import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  
  // 1. Crie um estado para segurar a tela enquanto a auth carrega
  const [loadingAuth, setLoadingAuth] = useState(true) 

  useEffect(() => {
    // 2. Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingAuth(false) // Terminou de checar!
    })

    // Escuta mudanças de auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoadingAuth(false) // Garante que o loading saia
    })

    return () => subscription.unsubscribe()
  }, [])

  // 3. SE ESTIVER CARREGANDO, NÃO RENDERIZE AS ROTAS AINDA!
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#283618]"></div>
      </div>
    )
  }

  // 4. Se já terminou de carregar, aí sim exibe as rotas
  return <AppRoutes session={session} />
}