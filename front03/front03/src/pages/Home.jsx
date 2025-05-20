import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Toast simples
function Toast({ message, onClose, color = "#11a051" }) {
  // Fecha automaticamente após 3 segundos
  const timer = useRef();
  useEffect(() => {
    if (message) {
      timer.current = setTimeout(onClose, 3000);
      return () => clearTimeout(timer.current);
    }
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div style={{
      position: "fixed",
      top: 24,
      right: 24,
      background: color,
      color: "#fff",
      padding: "16px 28px",
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 16,
      zIndex: 9999,
      boxShadow: "0 4px 24px 0 rgba(60,60,60,0.15)"
    }}>
      {message}
      <button
        style={{
          marginLeft: 18,
          background: "transparent",
          color: "#fff",
          border: "none",
          fontWeight: 700,
          fontSize: 18,
          cursor: "pointer"
        }}
        onClick={onClose}
        aria-label="Fechar"
      >×</button>
    </div>
  );
}

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [inscritos, setInscritos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [eventosInscrito, setEventosInscrito] = useState([]); // Novo estado
  const [toastColor, setToastColor] = useState("#11a051");
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    axios.get("http://localhost:3001/api/eventos")
      .then(res => {
        setEventos(res.data);
        // Após buscar eventos, filtra os que o usuário está inscrito
        const inscricoes = JSON.parse(localStorage.getItem("inscricoes_eventos") || "{}");
        const meusIds = inscricoes[usuario.id] || [];
        setEventosInscrito(res.data.filter(ev => meusIds.includes(ev.id)));
      })
      .catch(() => {
        setEventos([]);
        setEventosInscrito([]);
      });
    // Carrega inscrições do usuário logado
    const inscricoes = JSON.parse(localStorage.getItem("inscricoes_eventos") || "{}");
    setInscritos(inscricoes[usuario.id] || []);
    // Carrega projetos
    axios.get("http://localhost:3001/api/projetos")
      .then(res => setProjetos(res.data))
      .catch(() => setProjetos([]));
  }, [usuario.id]);

  const handleInscrever = async (id) => {
    try {
      await axios.post(`http://localhost:3001/api/eventos/${id}/inscrever`);
      setToastMsg("Inscrição realizada com sucesso!");
      setToastColor("#11a051");
      // Atualiza participantes e eventosInscrito
      axios.get("http://localhost:3001/api/eventos")
        .then(res => {
          setEventos(res.data);
          // Atualiza eventosInscrito após inscrição
          const inscricoes = JSON.parse(localStorage.getItem("inscricoes_eventos") || "{}");
          const meusIds = inscricoes[usuario.id] || [];
          setEventosInscrito(res.data.filter(ev => meusIds.includes(ev.id)));
        });
      // Marca como inscrito no localStorage
      const inscricoes = JSON.parse(localStorage.getItem("inscricoes_eventos") || "{}");
      const userInscritos = inscricoes[usuario.id] || [];
      if (!userInscritos.includes(id)) {
        inscricoes[usuario.id] = [...userInscritos, id];
        localStorage.setItem("inscricoes_eventos", JSON.stringify(inscricoes));
        setInscritos(inscricoes[usuario.id]);
      }
    } catch (err) {
      setToastMsg(err.response?.data?.erro || "Erro ao inscrever-se");
      setToastColor("#f1416c");
    }
  };

  // Função para cancelar inscrição
  const handleCancelarInscricao = (id) => {
    // Remove o evento do localStorage
    const inscricoes = JSON.parse(localStorage.getItem("inscricoes_eventos") || "{}");
    const userInscritos = inscricoes[usuario.id] || [];
    inscricoes[usuario.id] = userInscritos.filter(eid => eid !== id);
    localStorage.setItem("inscricoes_eventos", JSON.stringify(inscricoes));
    setInscritos(inscricoes[usuario.id]);
    // Atualiza eventosInscrito e eventos
    axios.post(`http://localhost:3001/api/eventos/${id}/cancelar-inscricao`)
      .then(() => {
        axios.get("http://localhost:3001/api/eventos")
          .then(res => {
            setEventos(res.data);
            const meusIds = inscricoes[usuario.id] || [];
            setEventosInscrito(res.data.filter(ev => meusIds.includes(ev.id)));
          });
        setToastMsg("Inscrição cancelada.");
        setToastColor("#ffc700"); // Amarelo
      })
      .catch(() => {
        setToastMsg("Erro ao cancelar inscrição.");
        setToastColor("#f1416c");
      });
  };

  const handleToastClose = () => setToastMsg("");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Toast message={toastMsg} onClose={handleToastClose} color={toastColor} />
      {/* Próximos Eventos */}
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18 }}>
        Próximos Eventos
      </h2>
      <div
        style={{
          display: "flex",
          gap: 28,
          overflowX: "auto",
          paddingBottom: 16,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {eventos.map((evento, idx) => {
          const jaInscrito = inscritos.includes(evento.id);
          // Limita a descrição a 50 caracteres
          const descricaoLimitada = evento.descricao
            ? evento.descricao.length > 30
              ? evento.descricao.substring(0, 30) + "..."
              : evento.descricao
            : "";

          return (
            <div
              key={evento.id}
              style={{
                minWidth: 320,
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 4px 24px 0 rgba(60,60,60,0.10)",
                display: "flex",
                flexDirection: "column",
                marginBottom: 8,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                overflow: "hidden",
                flex: "1 1 320px",
                maxWidth: "calc(33.333% - 19px)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 140,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  overflow: "hidden",
                  background: "#eee",
                }}
                onClick={() => navigate(`/eventos/${evento.id}`)} // <-- Alterado aqui
              >
                {evento.imagem ? (
                  <img
                    src={
                      evento.imagem.startsWith("/uploads/")
                        ? `http://localhost:3001${evento.imagem}`
                        : evento.imagem
                    }
                    alt={evento.titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#e5e7eb",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  padding: "18px 18px 10px 18px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#31313b",
                    marginBottom: 4,
                  }}
                >
                  {evento.titulo}
                </div>
                {/* Descrição limitada */}
                {descricaoLimitada && (
                  <div
                    style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                  >
                    {descricaoLimitada}
                  </div>
                )}
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  {evento.local || evento.endereco || "Local a definir"}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  {evento.cidade || ""}{" "}
                  {evento.estado ? `- ${evento.estado}` : ""}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  Capacidade: {evento.capacidade_total || "---"} |
                  Participantes: {evento.participantes || 0}
                </div>
                <div
                  style={{ fontWeight: 600, color: "#f1416c", fontSize: 15 }}
                >
                  {evento.data
                    ? new Date(evento.data).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        //hour: "2-digit",
                        //minute: "2-digit",
                      })
                    : "---"}
                </div>
                <button
                  style={{
                    background: jaInscrito ? "#bdbdbd" : "#ff234c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 0",
                    fontSize: "1rem",
                    fontWeight: 500,
                    cursor: jaInscrito ? "not-allowed" : "pointer",
                    margin: "16px auto 0 auto",
                    width: "90%",
                    transition: "background 0.2s",
                  }}
                  disabled={
                    jaInscrito ||
                    (evento.capacidade_total > 0 &&
                      evento.participantes >= evento.capacidade_total)
                  }
                  onClick={() => handleInscrever(evento.id)}
                >
                  {jaInscrito ? "Inscrito" : "Inscrever-se"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projetos em Andamento */}
      <h2 style={{ fontWeight: 700, fontSize: 26, margin: "32px 0 18px 0" }}>
        Projetos em Andamento
      </h2>
      <div
        style={{
          display: "flex",
          gap: 28,
          overflowX: "auto",
          paddingBottom: 16,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {projetos.map((projeto) => {
          // Limita a descrição a 30 caracteres
          const descricaoLimitada = projeto.descricao
            ? projeto.descricao.length > 30
              ? projeto.descricao.substring(0, 30) + "..."
              : projeto.descricao
            : "";
          // Formata datas
          const dataInicioFormatada = projeto.dataInicio
            ? new Date(projeto.dataInicio).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "---";
          const dataFimFormatada = projeto.dataFim
            ? new Date(projeto.dataFim).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "";
          return (
            <div
              key={projeto.id}
              style={{
                minWidth: 320,
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 4px 24px 0 rgba(60,60,60,0.10)",
                display: "flex",
                flexDirection: "column",
                marginBottom: 8,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                overflow: "hidden",
                flex: "1 1 320px",
                maxWidth: "calc(33.333% - 19px)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 140,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  overflow: "hidden",
                  background: "#eee",
                }}
              >
                {projeto.imagem ? (
                  <img
                    src={
                      projeto.imagem.startsWith("/uploads/")
                        ? `http://localhost:3001${projeto.imagem}`
                        : projeto.imagem
                    }
                    alt={projeto.titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#e5e7eb",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  padding: "18px 18px 10px 18px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#31313b",
                    marginBottom: 4,
                  }}
                >
                  {projeto.titulo}
                </div>
                {descricaoLimitada && (
                  <div
                    style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                  >
                    {descricaoLimitada}
                  </div>
                )}
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  {projeto.categoria || "---"}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  {projeto.endereco || "Endereço não informado"}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  Responsável: {projeto.responsavelNome || "---"}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  Início: {dataInicioFormatada}
                  {projeto.dataFim ? ` | Fim: ${dataFimFormatada}` : ""}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  Horário:{" "}
                  {projeto.horario ? projeto.horario.slice(0, 5) : "---"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meus Eventos Inscritos */}
      <h2 style={{ fontWeight: 700, fontSize: 26, margin: "32px 0 18px 0" }}>
        Meus Eventos Inscritos
      </h2>
      <div
        style={{
          display: "flex",
          gap: 28,
          overflowX: "auto",
          paddingBottom: 16,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {eventosInscrito.length === 0 && (
          <div style={{ color: "#6b7280", fontSize: 16, padding: 24 }}>
            Você ainda não está inscrito em nenhum evento.
          </div>
        )}
        {eventosInscrito.map((evento) => {
          // Limita a descrição a 30 caracteres
          const descricaoLimitada = evento.descricao
            ? evento.descricao.length > 30
              ? evento.descricao.substring(0, 30) + "..."
              : evento.descricao
            : "";
          return (
            <div
              key={evento.id}
              style={{
                minWidth: 320,
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 4px 24px 0 rgba(60,60,60,0.10)",
                display: "flex",
                flexDirection: "column",
                marginBottom: 8,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
                overflow: "hidden",
                flex: "1 1 320px",
                maxWidth: "calc(33.333% - 19px)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 140,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  overflow: "hidden",
                  background: "#eee",
                }}
              >
                {evento.imagem ? (
                  <img
                    src={
                      evento.imagem.startsWith("/uploads/")
                        ? `http://localhost:3001${evento.imagem}`
                        : evento.imagem
                    }
                    alt={evento.titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#e5e7eb",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  padding: "18px 18px 10px 18px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#31313b",
                    marginBottom: 4,
                  }}
                >
                  {evento.titulo}
                </div>
                {descricaoLimitada && (
                  <div
                    style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                  >
                    {descricaoLimitada}
                  </div>
                )}
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  {evento.local || evento.endereco || "Local a definir"}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  {evento.cidade || ""}{" "}
                  {evento.estado ? `- ${evento.estado}` : ""}
                </div>
                <div
                  style={{ color: "#6b7280", fontSize: 15, marginBottom: 2 }}
                >
                  Capacidade: {evento.capacidade_total || "---"} |
                  Participantes: {evento.participantes || 0}
                </div>
                <div
                  style={{ fontWeight: 600, color: "#f1416c", fontSize: 15 }}
                >
                  {evento.data
                    ? new Date(evento.data).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "---"}
                </div>
                <div style={{ display: "flex", marginTop: 16 }}>
                  <button
                    style={{
                      background: "#bdbdbd",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 0",
                      fontSize: "1rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      width: "100%",
                      transition: "background 0.2s",
                    }}
                    onClick={() => handleCancelarInscricao(evento.id)}
                  >
                    Cancelar Inscrição
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 40 }} />
      {/* Removido o <footer> daqui, pois agora é global pelo App.jsx */}
    </div>
  );
}