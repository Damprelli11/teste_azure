import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CadastroEvento() {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [data, setData] = useState('')
    const [imagem, setImagem] = useState('')
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    const handleCadastro = async (e) => {
        e.preventDefault()
        setErro(null)
        setSucesso(null)
        if (titulo && data) {
            try {
                await axios.post('http://localhost:3001/api/eventos', { titulo, descricao, data, imagem })
                setSucesso('Evento cadastrado com sucesso!')
                setTimeout(() => navigate('/eventos'), 1200)
            } catch {
                setErro('Erro ao cadastrar evento')
            }
        } else {
            setErro('Preencha os campos obrigatórios')
        }
    }

    return (
        <div>
            <h1>Novo Evento</h1>
            <form onSubmit={handleCadastro}>
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
                <button type="submit">Cadastrar</button>
                <button type="button" style={{marginLeft:10}} onClick={() => navigate('/eventos')}>Voltar</button>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    )
}
