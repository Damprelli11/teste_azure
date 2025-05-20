import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(null)
    const [pesquisa, setPesquisa] = useState("")
    const navigate = useNavigate()

    const fetchUsuarios = () => {
        setCarregando(true)
        axios.get('http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/usuarios')
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
            await axios.delete(`http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/usuarios/${id}`)
            setSucesso('Usuário deletado com sucesso!')
            fetchUsuarios()
        } catch {
            setErro('Erro ao deletar usuário')
        }
    }

    // Filtro de pesquisa
    const usuariosFiltrados = usuarios.filter(u =>
        (u.nome && u.nome.toLowerCase().includes(pesquisa.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(pesquisa.toLowerCase())) ||
        (u.tipo && u.tipo.toLowerCase().includes(pesquisa.toLowerCase()))
    )

    if (carregando) return <p>Carregando Usuários...</p>
    if (erro) return <p style={{color:'red'}}>{erro}</p>

    return (
      <div className="dashboard-content-container">
        <h1 style={{ marginBottom: 10 }}>Listagem de Usuários</h1>

        <div className="dashboard-actions-bar" style={{ justifyContent: "space-between" }}>
          <button
            className="btn-add"
            onClick={() => navigate("/usuarios/novo")}
          >
            + Novo
          </button>
          <div>
            <input
              type="text"
              placeholder="Pesquisar"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 12,
                border: "0.1px solid #e5e7eb",
                width: "100%",
                // Removido maxWidth duplicado
              }}
            />
          </div>
        </div>
        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th style={{ minWidth: "110px" }}>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Telefone</th>
                <th>RG</th>
                <th>Data Cadastro</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="usuarios-nome">{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.tipo}</td>
                  <td>
                    <span
                      className={
                        usuario.status === 1
                          ? "badge badge-ativo"
                          : "badge badge-inativo"
                      }
                    >
                      {usuario.status === 1 ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td>{usuario.telefone || "---"}</td>
                  <td>{usuario.rg || "---"}</td>
                  <td>
                    {usuario.dataCadastro
                      ? usuario.dataCadastro.substring(0, 10)
                      : "---"}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      style={{ marginRight: 8 }}
                      onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
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
                      onClick={() => handleDelete(usuario.id)}
                      title="Deletar"
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