import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function EditarEvento() {
    const { id } = useParams()
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [data, setData] = useState('')
    const [imagem, setImagem] = useState(null)
    const [imagemPreview, setImagemPreview] = useState('')
    const [capacidade_total, setCapacidadeTotal] = useState('')
    const [endereco, setEndereco] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/eventos/${id}`)
            .then(res => {
                setTitulo(res.data.titulo)
                setDescricao(res.data.descricao || '')
                setData(res.data.data ? res.data.data.substring(0,10) : '')
                setCapacidadeTotal(res.data.capacidade_total || '')
                setEndereco(res.data.endereco || '')
                setCidade(res.data.cidade || '')
                setEstado(res.data.estado || '')
                // Se já existe imagem, mostra preview
                if (res.data.imagem) {
                    setImagemPreview(
                        res.data.imagem.startsWith('/uploads/')
                            ? `http://localhost:3001${res.data.imagem}`
                            : res.data.imagem
                    )
                }
            })
            .catch(() => setErro('Erro ao carregar evento'))
    }, [id])

    const handleImagemChange = (e) => {
        const file = e.target.files[0]
        setImagem(file)
        if (file) {
            setImagemPreview(URL.createObjectURL(file))
        }
    }

    const handleEditar = async (e) => {
        e.preventDefault()
        setErro(null)
        setSucesso(null)
        if (titulo && data) {
            try {
                const formData = new FormData()
                formData.append('titulo', titulo)
                formData.append('descricao', descricao)
                formData.append('data', data)
                if (imagem) formData.append('imagem', imagem)
                formData.append('capacidade_total', capacidade_total)
                formData.append('endereco', endereco)
                formData.append('cidade', cidade)
                formData.append('estado', estado)
                await axios.put(`http://localhost:3001/api/eventos/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
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
        <div className="dashboard-content-container">
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>Editar Evento</h1>
            <form onSubmit={handleEditar} encType="multipart/form-data">
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
                    <label>Imagem:</label>
                    <input type="file" accept="image/*" onChange={handleImagemChange} />
                    {imagemPreview && (
                        <div style={{ marginTop: 8 }}>
                            <img src={imagemPreview} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
                        </div>
                    )}
                </div>
                <div>
                    <label>Capacidade Total:</label>
                    <input type="number" value={capacidade_total} onChange={e => setCapacidadeTotal(e.target.value)} min={0} />
                </div>
                <div>
                    <label>Endereço:</label>
                    <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} maxLength={255} />
                </div>
                <div>
                    <label>Cidade:</label>
                    <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} maxLength={100} />
                </div>
                <div>
                    <label>Estado:</label>
                    <select value={estado} onChange={e => setEstado(e.target.value)}>
                        <option value="">Selecione o estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </select>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => navigate('/eventos')}>Voltar</button>
                </div>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    )
}
