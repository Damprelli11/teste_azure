import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

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

export default function CadastroDoacao() {
    const { id } = useParams();
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario')) || { nome: '', email: '', id: '' };
    const [valor, setValor] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:3001/api/doacoes/${id}`)
                .then(res => {
                    setValor(formatarReal(res.data.valor?.toString() || ''));
                    setObservacoes(res.data.observacoes || '');
                })
                .catch(() => setMsg('Erro ao carregar doação'));
        }
    }, [id]);

    const handleValorChange = (e) => {
        let v = e.target.value;
        v = v.replace(/\D/g, '');
        v = v.slice(0, 10);
        let vFormatado = '';
        if (v.length > 0) {
            vFormatado = (Number(v) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        setValor(vFormatado);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        const valorNumerico = parseFloat(extrairNumero(valor));
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setMsg('O valor da doação deve ser maior que zero.');
            return;
        }
        try {
            if (id) {
                await axios.put(`http://localhost:3001/api/doacoes/${id}`, {
                    valor: valorNumerico,
                    observacoes
                });
                setMsg('Doação atualizada!');
            } else {
                await axios.post('http://localhost:3001/api/doacoes', {
                    usuario_id: usuario.id,
                    nome_completo: usuario.nome,
                    email: usuario.email,
                    valor: valorNumerico,
                    observacoes
                });
                setMsg('Doação registrada!');
            }
            setTimeout(() => navigate('/doacoes'), 1200);
        } catch {
            setMsg('Erro ao registrar/atualizar doação');
        }
    };

    return (
        <div className="dashboard-content-container">
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>{id ? 'Editar Doação' : 'Nova Doação'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input value={usuario.nome} disabled />
                </div>
                <div>
                    <label>Email:</label>
                    <input value={usuario.email} disabled />
                </div>
                <div>
                    <label>Valor (R$):</label>
                    <input
                        type="text"
                        value={valor}
                        onChange={handleValorChange}
                        required
                        inputMode="numeric"
                        pattern="^\R\$ ?\d{1,3}(\.\d{3})*,\d{2}$"
                        placeholder="R$ 0,00"
                    />
                </div>
                <div>
                    <label>Observações:</label>
                    <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} />
                </div>
                <button type="submit">{id ? 'Salvar' : 'Doar'}</button>
                <button type="button" style={{marginLeft:10}} onClick={() => navigate('/doacoes')}>Voltar</button>
            </form>
            {msg && <p>{msg}</p>}
        </div>
    );
}
