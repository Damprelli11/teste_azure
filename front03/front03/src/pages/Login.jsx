import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
                // Salva dados do usuário no localStorage
                if (data.usuario) {
                    localStorage.setItem('usuario', JSON.stringify(data.usuario))
                }
                navigate('/home')
            } else {
                setErro(data.erro || 'Falha no login')
            }
        } catch (err) {
            setErro('Erro ao conectar ao servidor')
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f7f7"
        }}>
            <div style={{
                width: 350,
                background: "transparent",
                borderRadius: 18,
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0"
            }}>
                <img
                    src="/image_1.png"
                    alt="Instituto Criativo"
                    style={{
                        width: 90,
                        height: 90,
                        marginBottom: 32,
                        marginTop: 0,
                        borderRadius: 24,
                        objectFit: "contain"
                    }}
                />
                <h2 style={{
                    fontWeight: 400,
                    marginBottom: 24,
                    color: "#444",
                    fontSize: 2 + "rem"
                }}>Login</h2>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "14px 12px",
                            fontSize: "1rem",
                            borderRadius: 6,
                            border: "1px solid #ddd",
                            marginBottom: 16,
                            outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "14px 12px",
                            fontSize: "1rem",
                            borderRadius: 6,
                            border: "1px solid #ddd",
                            marginBottom: 24,
                            outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background: "#ff234c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 999,
                            padding: "14px 0",
                            fontSize: "1.2rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            marginBottom: 12,
                            transition: "background 0.2s"
                        }}
                    >
                        Entrar
                    </button>
                </form>
                <Link
                    to="/cadastro"
                    style={{
                        color: "#2196f3",
                        textDecoration: "none",
                        fontSize: "1rem",
                        marginTop: 8
                    }}
                >
                    Registre-se
                </Link>
                {erro && <div style={{ color: 'red', marginTop: 16 }}>{erro}</div>}
            </div>
        </div>
    )
}