import { Routes, Route } from "react-router-dom"
import { Login } from "./components/Login"
import { Register } from "./components/Register"
import { PublicRoute } from "./components/PublicRoute"
import { PrivateRoute } from "./components/PrivateRoute"
import { Home } from './pages/index'
import { OcorrenciaForm } from "./components/Ocorrencia"

export default function AppRoutes({ session }) {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <PrivateRoute session={session}>
            <Home />
          </PrivateRoute>
        }
      />

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

      {/* Rota para editar (o :id é o que o seu useParams captura) */}

      <Route
        path="/ocorrencias/:id/editar"
        element={
          <PrivateRoute session={session}>
            <OcorrenciaForm />
          </PrivateRoute>
        } />

    </Routes>
  )
}