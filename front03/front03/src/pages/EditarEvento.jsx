import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function EditarEvento() {
    const { id } = useParams()
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [data, setData] = useState('')
    const [imagem, setImagem] = useState('')
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/eventos/${id}`)
            .then(res => {
                setTitulo(res.data.titulo)
                setDescricao(res.data.descricao || '')
                setData(res.data.data ? res.data.data.substring(0,10) : '')
                setImagem(res.data.imagem || '')
            })
            .catch(() => setErro('Erro ao carregar evento'))
    }, [id])

    const handleEditar = async (e) => {
        e.preventDefault()
        setErro(null)
        setSucesso(null)
        if (titulo && data) {
            try {
                await axios.put(`http://localhost:3001/api/eventos/${id}`, { titulo, descricao, data, imagem })
                setSucesso('Evento atualizado com sucesso!')
                setTimeout(() => navigate('/eventos'), 1200)
            } catch {
                setErro('Erro ao atualizar evento')
            }
        } else {
            setErro('Preencha os campos obrigatórios')
        }
    }

    return (
        <div>
            <h1>Editar Evento</h1>
            <form onSubmit={handleEditar}>
                <div>
                    <label>Título:</label>
                    <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required maxLength={255} />
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
                <div>
                    <label>Data:</label>
                    <input type="date" value={data} onChange={e => setData(e.target.value)} required />
                </div>
                <div>
                    <label>Imagem (URL):</label>
                    <input type="text" value={imagem} onChange={e => setImagem(e.target.value)} />
                </div>
                <button type="submit">Salvar</button>
                <button type="button" style={{marginLeft:10}} onClick={() => navigate('/eventos')}>Voltar</button>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    )
}
