import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function EditarUsuario() {
    const { id } = useParams()
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [tipo, setTipo] = useState('participante')
    const [telefone, setTelefone] = useState('')
    const [rg, setRg] = useState('')
    const [dataCadastro, setDataCadastro] = useState('')
    const [status, setStatus] = useState(1)
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/usuarios/${id}`)
            .then(res => {
                setNome(res.data.nome)
                setEmail(res.data.email)
                setTipo(res.data.tipo || 'participante')
                setTelefone(res.data.telefone || '')
                setRg(res.data.rg || '')
                setDataCadastro(res.data.dataCadastro ? res.data.dataCadastro.substring(0, 10) : '')
                setStatus(res.data.status !== undefined ? res.data.status : 1)
            })
            .catch(() => setErro('Erro ao carregar usuário'))
    }, [id])

    const handleEditar = async (e) => {
        e.preventDefault()
        setErro(null)
        setSucesso(null)
        if (nome && email && tipo) {
            try {
                await axios.put(`http://localhost:3001/api/usuarios/${id}`, { nome, email, senha, tipo, telefone, rg, status })
                setSucesso('Usuário atualizado com sucesso!')
                setTimeout(() => navigate('/usuarios'), 1200)
            } catch {
                setErro('Erro ao atualizar usuário')
            }
        } else {
            setErro('Preencha todos os campos obrigatórios')
        }
    }

    return (
        <div className="dashboard-content-container">
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>Editar Usuário</h1>
            <form onSubmit={handleEditar}>
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
                    <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Deixe em branco para não alterar" />
                </div>
                <div>
                    <label>Tipo*:</label>
                    <select value={tipo} onChange={e => setTipo(e.target.value)} required>
                        <option value="admin">Admin</option>
                        <option value="voluntario">Voluntário</option>
                        <option value="participante">Participante</option>
                        <option value="doador">Doador</option>
                        <option value="instrutor">Instrutor</option>
                    </select>
                </div>
                <div>
                    <label>Telefone:</label>
                    <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} maxLength={20} />
                </div>
                <div>
                    <label>RG:</label>
                    <input type="text" value={rg} onChange={e => setRg(e.target.value)} maxLength={20} />
                </div>
                <div>
                    <label>Status:</label>
                    <select value={status} onChange={e => setStatus(Number(e.target.value))}>
                        <option value={1}>Ativo</option>
                        <option value={0}>Inativo</option>
                    </select>
                </div>
                <div>
                    <label>Data Cadastro:</label>
                    <input type="text" value={dataCadastro} readOnly />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => navigate('/usuarios')}>Voltar</button>
                </div>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    )
}
