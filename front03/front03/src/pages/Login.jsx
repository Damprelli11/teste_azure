import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErro('')
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            })
            const data = await response.json()
            if (response.ok) {
                localStorage.setItem('auth', 'true')
                navigate('/dashboard')
            } else {
                setErro(data.erro || 'Falha no login')
            }
        } catch (err) {
            setErro('Erro ao conectar ao servidor')
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
            {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
        </div>
    )
}