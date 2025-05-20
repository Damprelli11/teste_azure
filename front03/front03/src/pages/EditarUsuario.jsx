import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function EditarUsuario() {
    const { id } = useParams()
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/usuarios/${id}`)
            .then(res => {
                setNome(res.data.nome)
                setEmail(res.data.email)
            })
            .catch(() => setErro('Erro ao carregar usuário'))
    }, [id])

    const handleEditar = async (e) => {
        e.preventDefault()
        setErro(null)
        setSucesso(null)
        if (nome && email) {
            try {
                await axios.put(`http://localhost:3001/api/usuarios/${id}`, { nome, email })
                setSucesso('Usuário atualizado com sucesso!')
                setTimeout(() => navigate('/usuarios'), 1200)
            } catch {
                setErro('Erro ao atualizar usuário')
            }
        } else {
            setErro('Preencha todos os campos')
        }
    }

    return (
        <div>
            <h1>Editar Usuário</h1>
            <form onSubmit={handleEditar}>
                <div>
                    <label>Nome:</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required maxLength={30} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit">Salvar</button>
                <button type="button" style={{marginLeft:10}} onClick={() => navigate('/usuarios')}>Voltar</button>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    )
}
