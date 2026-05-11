import { authService } from '../services/authService'
import { useState } from 'react'

export function Logout() {
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            await authService.signOut()
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="mt-2 hover:cursor-pointer text-gray-600 hover:text-red-600 hover:bg-red-50 font-medium p-2 rounded-md transition-colors duration-200"
        >
            Sair do Sistema
        </button>
    )
}