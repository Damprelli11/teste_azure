import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventoDetalhe() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCarregando(true);
    axios.get(`http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net/api/eventos/${id}`)
      .then(res => setEvento(res.data))
      .catch(() => setErro("Erro ao carregar evento"))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) return <div style={{padding: 32}}>Carregando...</div>;
  if (erro) return <div style={{padding: 32, color: "red"}}>{erro}</div>;
  if (!evento) return null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 18, border: "none", background: "#eee", borderRadius: 8, padding: "8px 18px", cursor: "pointer" }}>Voltar</button>
      <div style={{
        display: "flex",
        gap: 32,
        flexWrap: "wrap",
        alignItems: "flex-start",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 24px 0 rgba(60,60,60,0.10)",
        padding: 24
      }}>
        <div style={{ flex: "0 0 320px", maxWidth: 340 }}>
          {evento.imagem ? (
            <img
              src={evento.imagem.startsWith("/uploads/") ? `http://instituto-criativo-e5hzbqhcedf4ftg6.brazilsouth-01.azurewebsites.net${evento.imagem}` : evento.imagem}
              alt={evento.titulo}
              style={{ width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 220 }}
            />
          ) : (
            <div style={{ width: "100%", height: 220, background: "#e5e7eb", borderRadius: 12 }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>{evento.titulo}</h1>
          <div style={{ color: "#6b7280", fontSize: 17, marginBottom: 10 }}>
            {evento.descricao || "Sem descrição"}
          </div>
          <div style={{ marginBottom: 10 }}>
            <b>Data:</b>{" "}
            {evento.data
              ? new Date(evento.data).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "---"}
          </div>
          <div style={{ marginBottom: 10 }}>
            <b>Endereço:</b> {evento.endereco || "Não informado"}
          </div>
          <div style={{ marginBottom: 10 }}>
            <b>Cidade:</b> {evento.cidade || "---"} {evento.estado ? `- ${evento.estado}` : ""}
          </div>
          <div style={{ marginBottom: 10 }}>
            <b>Capacidade:</b> {evento.capacidade_total || "---"}
          </div>
          <div style={{ marginBottom: 10 }}>
            <b>Participantes:</b> {evento.participantes || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
