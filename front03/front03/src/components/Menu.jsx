import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function Menu() {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth') === 'true')
    const location = useLocation()

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('auth') === 'true')
    }, [location])

    return (
        <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
            <Link to="/" style={{ marginRight: 10 }}>Home</Link>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/dashboard" style={{ marginRight: 10 }}>Dashboard</Link>
            {isAuthenticated && <Link to="/usuarios" style={{ marginRight: 10 }}>Usuários</Link>}
            {isAuthenticated && <Link to="/eventos">Eventos</Link>}
        </nav>
    )
}