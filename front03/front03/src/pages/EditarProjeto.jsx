import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function EditarProjeto() {
    const { id } = useParams()
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [categoria, setCategoria] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [horario, setHorario] = useState('')
    const [endereco, setEndereco] = useState('')
    const [responsavelId, setResponsavelId] = useState('')
    const [usuarios, setUsuarios] = useState([])
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const [imagem, setImagem] = useState(null)
    const [imagemPreview, setImagemPreview] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:3001/api/projetos/usuarios')
            .then(res => setUsuarios(res.data))
            .catch(() => setUsuarios([]))
        axios.get(`http://localhost:3001/api/projetos/${id}`)
            .then(res => {
                setTitulo(res.data.titulo)
                setDescricao(res.data.descricao || '')
                setCategoria(res.data.categoria || '')
                setDataInicio(res.data.dataInicio ? res.data.dataInicio.substring(0,10) : '')
                setDataFim(res.data.dataFim ? res.data.dataFim.substring(0,10) : '')
                setHorario(res.data.horario || '')
                setEndereco(res.data.endereco || '')
                setResponsavelId(res.data.responsavelId || '')
                // Preview da imagem existente
                if (res.data.imagem) {
                    setImagemPreview(
                        res.data.imagem.startsWith('/uploads/')
                            ? `http://localhost:3001${res.data.imagem}`
                            : res.data.imagem
                    )
                }
            })
            .catch(() => setErro('Erro ao carregar projeto'))
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
        if (titulo && dataInicio && horario && endereco) {
            try {
                const formData = new FormData()
                formData.append('titulo', titulo)
                formData.append('descricao', descricao)
                formData.append('categoria', categoria)
                formData.append('dataInicio', dataInicio)
                formData.append('dataFim', dataFim)
                formData.append('horario', horario)
                formData.append('endereco', endereco)
                formData.append('responsavelId', responsavelId || '')
                if (imagem) formData.append('imagem', imagem)
                await axios.put(`http://localhost:3001/api/projetos/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                setSucesso('Projeto atualizado com sucesso!')
                setTimeout(() => navigate('/projetos'), 1200)
            } catch {
                setErro('Erro ao atualizar projeto')
            }
        } else {
            setErro('Preencha os campos obrigatórios')
        }
    }

    return (
        <div className="dashboard-content-container">
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>Editar Projeto</h1>
            <form onSubmit={handleEditar} encType="multipart/form-data">
                <div>
                    <label>Título*:</label>
                    <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required maxLength={255} />
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
                <div>
                    <label>Categoria:</label>
                    <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} maxLength={100} />
                </div>
                <div>
                    <label>Data Início*:</label>
                    <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} required />
                </div>
                <div>
                    <label>Data Fim:</label>
                    <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                </div>
                <div>
                    <label>Horário*:</label>
                    <input
                        type="time"
                        value={horario}
                        onChange={e => setHorario(e.target.value)}
                        required
                        maxLength={50}
                    />
                </div>
                <div>
                    <label>Endereço*:</label>
                    <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} required maxLength={255} />
                </div>
                <div>
                    <label>Responsável:</label>
                    <select value={responsavelId || ''} onChange={e => setResponsavelId(e.target.value)}>
                        <option value="">Selecione o responsável</option>
                        {usuarios.map(u => (
                            <option key={u.id} value={u.id}>{u.nome}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Imagem:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagemChange}
                    />
                    {imagemPreview && (
                        <div style={{ marginTop: 8 }}>
                            <img src={imagemPreview} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => navigate('/projetos')}>Voltar</button>
                </div>
            </form>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    )
}
