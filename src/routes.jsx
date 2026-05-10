import { Routes, Route } from "react-router-dom"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { PublicRoute } from "./components/PublicRoute"
import { PrivateRoute } from "./components/PrivateRoute"
import { Home } from './pages/index'
import { OcorrenciaForm, OcorrenciaLista } from "./components/Ocorrencia"
import { Clientes } from "./pages/Clientes"
import { CriarCliente } from "./components/Cliente"
import { CriarSuporte } from "./components/Suporte"
import { CriarSistema } from "./components/Sistema"
import { CriarProblema } from "./components/Problema"
import { Dashboard } from "./pages/Dashboard"

export default function AppRoutes({ session }) {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute session={session}>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute session={session}>
            <Register />
          </PublicRoute>
        }
      />

      {/* Rotas Privadas (Protegidas) */}
      <Route
        path="/"
        element={
          <PrivateRoute session={session}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/ocorrencias"
        element={
          <PrivateRoute session={session}>
            <OcorrenciaLista />
          </PrivateRoute>
        }
      />

      <Route
        path="/ocorrencias/nova"
        element={
          <PrivateRoute session={session}>
            <OcorrenciaForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/ocorrencias/:id/editar"
        element={
          <PrivateRoute session={session}>
            <OcorrenciaForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <PrivateRoute session={session}>
            <Clientes />
          </PrivateRoute>
        }
      />

      <Route
        path="/clientes/novo"
        element={
          <PrivateRoute session={session}>
            <CriarCliente />
          </PrivateRoute>
        }
      />

      <Route
        path="/suportes/novo"
        element={
          <PrivateRoute session={session}>
            <CriarSuporte />
          </PrivateRoute>
        }
      />

      <Route
        path="/sistemas/novo"
        element={
          <PrivateRoute session={session}>
            <CriarSistema />
          </PrivateRoute>
        }
      />

      <Route
        path="/problemas/novo"
        element={
          <PrivateRoute session={session}>
            <CriarProblema />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}