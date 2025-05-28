import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#ff234c", "#ffc700", "#2196f3", "#11a051", "#00C49F", "#FFBB28", "#0088FE", "#FF8042"];

export default function Graficos() {
  const [dadosMes, setDadosMes] = useState([]);
  const [eventosPorEstado, setEventosPorEstado] = useState([]);
  const [capacidadeEventos, setCapacidadeEventos] = useState([]);
  const [totalDoado, setTotalDoado] = useState(0);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3001/api/eventos"),
      axios.get("http://localhost:3001/api/projetos"),
      axios.get("http://localhost:3001/api/doacoes"),
    ]).then(([evRes, prRes, doacoesRes]) => {
      // Gráfico 1: Eventos e Projetos por mês
      const agruparPorMes = (lista, campoData) => {
        const meses = {};
        lista.forEach(item => {
          const data = item[campoData];
          if (!data) return;
          const mes = new Date(data).toLocaleString("pt-BR", { month: "short", year: "numeric" });
          meses[mes] = (meses[mes] || 0) + 1;
        });
        return meses;
      };
      const eventosPorMes = agruparPorMes(evRes.data, "data");
      const projetosPorMes = agruparPorMes(prRes.data, "dataInicio");
      const meses = Array.from(new Set([...Object.keys(eventosPorMes), ...Object.keys(projetosPorMes)]));
      meses.sort((a, b) => {
        const [ma, ya] = a.split(" ");
        const [mb, yb] = b.split(" ");
        return new Date(`01 ${ma} ${ya}`) - new Date(`01 ${mb} ${yb}`);
      });
      setDadosMes(
        meses.map(mes => ({
          mes,
          Eventos: eventosPorMes[mes] || 0,
          Projetos: projetosPorMes[mes] || 0,
        }))
      );

      // Gráfico 2: Eventos por estado (Pie)
      const estadoMap = {};
      evRes.data.forEach(ev => {
        const estado = ev.estado || "Não informado";
        estadoMap[estado] = (estadoMap[estado] || 0) + 1;
      });
      setEventosPorEstado(
        Object.entries(estadoMap).map(([estado, qtd]) => ({
          name: estado,
          value: qtd
        }))
      );

      // Gráfico 3: Capacidade vs Participantes por evento
      setCapacidadeEventos(
        evRes.data.map(ev => ({
          nome: ev.titulo,
          Capacidade: Number(ev.capacidade_total) || 0,
          Participantes: Number(ev.participantes) || 0
        }))
      );

      // Gráfico total doado
      const doacoes = doacoesRes.data || [];
      const total = doacoes.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);
      setTotalDoado(total);
    });
  }, []);

  return (
    <div className="dashboard-content-container">
      <h1 style={{ marginBottom: 24 }}>Gráficos do Sistema</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          justifyContent: "space-between",
        }}
      >
        {/* Total Doado */}
        <div style={{ flex: "1 1 340px", minWidth: 320, maxWidth: 420 }}>
          <div
            style={{ textAlign: "center", fontWeight: 600, marginBottom: 8 }}
          >
            Total Doado (R$)
          </div>
          <div
            style={{
              width: "100%",
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#ff234c", // cor principal da logo
                textAlign: "center",
              }}
            >
              {totalDoado.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        </div>
        {/* Gráfico 1 */}
        <div style={{ flex: "1 1 340px", minWidth: 320, maxWidth: 420 }}>
          <div
            style={{ textAlign: "center", fontWeight: 600, marginBottom: 8 }}
          >
            Eventos e Projetos por Mês
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dadosMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Eventos" fill="#ff234c" />
                <Bar dataKey="Projetos" fill="#ffc700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Gráfico 2 */}
        <div style={{ flex: "1 1 340px", minWidth: 320, maxWidth: 420 }}>
          <div
            style={{ textAlign: "center", fontWeight: 600, marginBottom: 8 }}
          >
            Eventos por Estado
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={eventosPorEstado}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {eventosPorEstado.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Gráfico 3 */}
        <div style={{ flex: "1 1 340px", minWidth: 320, maxWidth: 420 }}>
          <div
            style={{ textAlign: "center", fontWeight: 600, marginBottom: 8 }}
          >
            Capacidade x Participantes
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={capacidadeEventos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nome"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Capacidade" fill="#2196f3" />
                <Bar dataKey="Participantes" fill="#11a051" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
