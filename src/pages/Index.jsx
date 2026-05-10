import {Logout} from '../components/Logout'
import { Link } from 'react-router-dom'
import { CriarSuporte } from '../components/Suporte'
import { CriarSistema } from '../components/Sistema'
import { CriarCliente } from '../components/Cliente'

export function Home() {
    return (
        <>
        <h1>Hello World</h1>
        <Logout />

        <CriarSuporte />
        <CriarSistema />
        <CriarCliente />
        </>
    )
}