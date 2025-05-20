import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import axios from 'axios'

export default function Cadastro(){
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [tipo, setTipo] = useState('participante')
    const [telefone, setTelefone] = useState('')
    const [rg, setRg] = useState('')
    const [status, setStatus] = useState(1)
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    const handleCadastro = async (e) => {
        e.preventDefault()
        setErro(null)
        setSucesso(null)
        if(email && senha && nome && tipo){
            try {
                await axios.post('http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/usuarios', {nome, email, senha, tipo, telefone, rg, status})
                setSucesso('Cadastro realizado com sucesso!')
                setTimeout(()=>navigate('/login'), 1500)
            } catch (err) {
                setErro('Erro ao cadastrar usuário')
            }
        } else {
            setErro('Preencha todos os campos obrigatórios')
        }
    }

    return (
        <div>
            <h1>Cadastro de Usuário</h1>
            <form onSubmit={handleCadastro}>
                <div>
                    <label>Nome:</label>
                    <input type="text" value={nome} onChange={e=>setNome(e.target.value)} required maxLength={30}/>
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} required />
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
                <button type="submit">Salvar</button>
            </form>
            {erro && <p style={{color:'red'}}>{erro}</p>}
            {sucesso && <p style={{color:'green'}}>{sucesso}</p>}
            <p>Já tem conta? <Link to="/login">Faça login</Link></p>
        </div>
    )
}
