import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CadastroUsuario() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    const handleCadastro = async (e) => {
        e.preventDefault()
        setErro(null)
        setSucesso(null)
        if (email && senha && nome) {
            try {
                await axios.post('http://localhost:3001/api/usuarios', { nome, email, senha })
                setSucesso('Cadastro realizado com sucesso!')
                setTimeout(() => navigate('/usuarios'), 1200)
            } catch (err) {
                setErro('Erro ao cadastrar usuário')
            }
        } else {
            setErro('Preencha todos os campos')
        }
    }

    return (
        <div>
            <h1>Novo Usuário</h1>
            <form onSubmit={handleCadastro}>
                <div>
                    <label>Nome:</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required maxLength={30} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
                <button type="submit">Cadastrar</button>
                <button type="button" style={{marginLeft:10}} onClick={() => navigate('/usuarios')}>Voltar</button>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    )
}
