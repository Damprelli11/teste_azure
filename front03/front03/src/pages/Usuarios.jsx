import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    const fetchUsuarios = () => {
        setCarregando(true)
        axios.get('http://localhost:3001/api/usuarios')
            .then(res => setUsuarios(res.data))
            .catch(() => setErro("Erro ao carregar usuários"))
            .finally(() => setCarregando(false))
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Deseja realmente deletar este usuário?')) return
        try {
            await axios.delete(`http://localhost:3001/api/usuarios/${id}`)
            setSucesso('Usuário deletado com sucesso!')
            fetchUsuarios()
        } catch {
            setErro('Erro ao deletar usuário')
        }
    }

    if (carregando) return <p>Carregando Usuários...</p>
    if (erro) return <p style={{color:'red'}}>{erro}</p>

    return (
        <div>
            <h1>Lista de Usuários</h1>
            <button onClick={() => navigate('/usuarios/novo')} style={{marginBottom: 20}}>Novo +</button>
            {sucesso && <p style={{color:'green'}}>{sucesso}</p>}
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id}>
                        {usuario.nome} - {usuario.email}
                        <button style={{marginLeft:10}} onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}>Editar</button>
                        <button style={{marginLeft:5}} onClick={() => handleDelete(usuario.id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}