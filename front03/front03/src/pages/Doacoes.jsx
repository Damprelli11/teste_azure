import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Função para formatar valor como moeda BRL
function formatarReal(valor) {
    if (valor === '' || valor === null) return '';
    const num = Number(valor.replace(/\D/g, '')) / 100;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para extrair valor numérico do input formatado
function extrairNumero(valor) {
    if (!valor) return '';
    return (Number(valor.replace(/\D/g, '')) / 100).toFixed(2);
}

export default function Doacoes() {
    // Atualiza leitura do usuário logado
    const usuario = JSON.parse(localStorage.getItem('usuario')) || { nome: '', email: '', id: '' };
    // Restrição: participante ou doador só pode acessar a tela de cadastro
    if (usuario?.tipo === "participante" || usuario?.tipo === "doador") {
        window.location.href = "/doacoes/novo";
        return null;
    }

    const [doacoes, setDoacoes] = useState([]);
    const [valor, setValor] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [msg, setMsg] = useState('');
    const [editId, setEditId] = useState(null);
    const [pesquisa, setPesquisa] = useState('');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        listar();
    }, []);

    const listar = async () => {
        const res = await axios.get('http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/doacoes');
        setDoacoes(res.data);
    };

    // Handler para máscara de dinheiro
    const handleValorChange = (e) => {
        let v = e.target.value;
        // Remove tudo que não for número
        v = v.replace(/\D/g, '');
        // Limita a 10 dígitos (DECIMAL(10,2))
        v = v.slice(0, 10);
        // Formata para moeda
        let vFormatado = '';
        if (v.length > 0) {
            vFormatado = (Number(v) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        setValor(vFormatado);
    };

    const cadastrar = async (e) => {
        e.preventDefault();
        setMsg('');
        // Extrai valor numérico para validação e envio ao backend
        const valorNumerico = parseFloat(extrairNumero(valor));
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setMsg('O valor da doação deve ser maior que zero.');
            return;
        }
        try {
            if (editId) {
                await axios.put(`http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/doacoes/${editId}`, {
                    valor: valorNumerico,
                    observacoes
                });
                setMsg('Doação atualizada!');
            } else {
                await axios.post('http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/doacoes', {
                    usuario_id: usuario.id,
                    nome_completo: usuario.nome,
                    email: usuario.email,
                    valor: valorNumerico,
                    observacoes
                });
                setMsg('Doação registrada!');
            }
            setValor('');
            setObservacoes('');
            setEditId(null);
            setShowForm(false);
            listar();
        } catch {
            setMsg('Erro ao registrar/atualizar doação');
        }
    };

    const handleEdit = (doacao) => {
        setEditId(doacao.id);
        // Formata valor para moeda ao editar
        setValor(formatarReal(doacao.valor?.toString() || ''));
        setObservacoes(doacao.observacoes || '');
        setMsg('');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Deseja realmente deletar esta doação?')) return;
        try {
            await axios.delete(`http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/doacoes/${id}`);
            setMsg('Doação deletada!');
            listar();
        } catch {
            setMsg('Erro ao deletar doação');
        }
    };

    const cancelarEdicao = () => {
        setEditId(null);
        setValor('');
        setObservacoes('');
        setMsg('');
        setShowForm(false);
    };

    // Função para exportar doações para Excel
    const exportarDoacoesExcel = async () => {
        try {
            const res = await axios.get('http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/doacoes/exportar-excel', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'doacoes.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            setMsg('Erro ao exportar doações');
        }
    };

    // Filtro de pesquisa
    const doacoesFiltradas = doacoes.filter(d =>
        (d.nome_completo && d.nome_completo.toLowerCase().includes(pesquisa.toLowerCase())) ||
        (d.email && d.email.toLowerCase().includes(pesquisa.toLowerCase())) ||
        (d.observacoes && d.observacoes.toLowerCase().includes(pesquisa.toLowerCase()))
    );

    return (
      <div className="dashboard-content-container">
        <h1 style={{ marginBottom: 10 }}>Listagem de Doações</h1>
        <div
          className="dashboard-actions-bar"
          style={{ justifyContent: "space-between" }}
        >
          <button className="btn-add" onClick={() => navigate("/doacoes/novo")}>
            + Novo
          </button>
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
              marginBottom: 0,
            }}
          />
        </div>
        {msg && <p>{msg}</p>}
        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th style={{ minWidth: "110px" }}>Nome</th>
                <th>Email</th>
                <th>Valor</th>
                <th>Observações</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {doacoesFiltradas.map((d) => (
                <tr key={d.id}>
                  <td>{d.nome_completo}</td>
                  <td>{d.email}</td>
                  <td>
                    R${" "}
                    {Number(d.valor).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{d.observacoes || "---"}</td>
                  <td>
                    <button
                      className="btn-edit"
                      style={{ marginRight: 8 }}
                      onClick={() => navigate(`/doacoes/editar/${d.id}`)}
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
                      onClick={() => handleDelete(d.id)}
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
