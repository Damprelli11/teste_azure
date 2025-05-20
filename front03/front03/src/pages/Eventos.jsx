import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Eventos() {
    const [eventos, setEventos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    const fetchEventos = () => {
        setCarregando(true)
        axios.get('http://localhost:3001/api/eventos')
            .then(res => setEventos(res.data))
            .catch(() => setErro("Erro ao carregar eventos"))
            .finally(() => setCarregando(false))
    }

    useEffect(() => {
        fetchEventos()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Deseja realmente deletar este evento?')) return
        try {
            await axios.delete(`http://localhost:3001/api/eventos/${id}`)
            setSucesso('Evento deletado com sucesso!')
            fetchEventos()
        } catch {
            setErro('Erro ao deletar evento')
        }
    }

    if (carregando) return <p>Carregando Eventos...</p>
    if (erro) return <p style={{color:'red'}}>{erro}</p>

    return (
        <div>
            <h1>Eventos Institucionais</h1>
            <button onClick={() => navigate('/eventos/novo')} style={{marginBottom: 20}}>Novo +</button>
            {sucesso && <p style={{color:'green'}}>{sucesso}</p>}
            <ul>
                {eventos.map(evento => (
                    <li key={evento.id}>
                        <strong>{evento.titulo}</strong> - {evento.data}
                        <button style={{marginLeft:10}} onClick={() => navigate(`/eventos/editar/${evento.id}`)}>Editar</button>
                        <button style={{marginLeft:5}} onClick={() => handleDelete(evento.id)}>Deletar</button>
                        <div>{evento.descricao}</div>
                        {evento.imagem && <img src={evento.imagem} alt={evento.titulo} style={{maxWidth:100, display:'block', margin:'5px 0'}} />}
                    </li>
                ))}
            </ul>
        </div>
    )
}
