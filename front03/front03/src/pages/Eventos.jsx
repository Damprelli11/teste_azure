import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Eventos() {
    const [eventos, setEventos] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const [pesquisa, setPesquisa] = useState("")
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

    const handleInscrever = async (id) => {
        try {
            await axios.post(`http://localhost:3001/api/eventos/${id}/inscrever`);
            setSucesso('Inscrição realizada com sucesso!');
            fetchEventos();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao inscrever-se');
        }
    }

    // Filtro de pesquisa
    const eventosFiltrados = eventos
      .filter(e =>
        (e.titulo && e.titulo.toLowerCase().includes(pesquisa.toLowerCase())) ||
        (e.descricao && e.descricao.toLowerCase().includes(pesquisa.toLowerCase()))
      )
      .sort((a, b) => new Date(a.data) - new Date(b.data))

    if (carregando) return <p>Carregando Eventos...</p>
    if (erro) return <p style={{color:'red'}}>{erro}</p>

    return (
      <div className="dashboard-content-container">
        <h1 style={{ marginBottom: 10 }}>Listagem de Eventos</h1>
        <div
          className="dashboard-actions-bar"
          style={{ justifyContent: "space-between" }}
        >
          <button className="btn-add" onClick={() => navigate("/eventos/novo")}>
            + Novo
          </button>
          <div>
            <input
              type="text"
              placeholder="Pesquisar"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              style={{
                maxWidth: 200,
                padding: 10,
                borderRadius: 12,
                border: "0.1px solid #e5e7eb",
              }}
            />
          </div>
        </div>
        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th style={{ minWidth: "110px" }}>Título</th>
                <th>Descrição</th>
                <th>Data</th>
                <th>Imagem</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Capacidade</th>
                <th>Participantes</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((evento) => (
                <tr key={evento.id}>
                  <td>{evento.titulo}</td>
                  <td>
                    {evento.descricao
                      ? evento.descricao.length > 80
                        ? evento.descricao.substring(0, 40) + "..."
                        : evento.descricao
                      : "---"}
                  </td>
                  <td>{evento.data ? evento.data.substring(0, 10) : "---"}</td>
                  <td>
                    {evento.imagem ? (
                      <img
                        src={
                          evento.imagem.startsWith("/uploads/")
                            ? `http://localhost:3001${evento.imagem}`
                            : evento.imagem
                        }
                        alt={evento.titulo}
                        style={{ maxWidth: 60, maxHeight: 60, borderRadius: 6 }}
                      />
                    ) : (
                      "---"
                    )}
                  </td>
                  <td>{evento.cidade || "---"}</td>
                  <td>{evento.estado || "---"}</td>
                  <td>{evento.capacidade_total || "---"}</td>
                  <td>{evento.participantes || 0}</td>
                  <td>
                    <button
                      className="btn-edit"
                      style={{ marginRight: 8 }}
                      onClick={() => navigate(`/eventos/editar/${evento.id}`)}
                      title="Editar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                      </svg>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(evento.id)}
                      title="Deletar"
                      style={{ marginRight: 8 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}
