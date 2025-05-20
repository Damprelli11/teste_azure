const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path"); // Adicione esta linha

app.use(cors());
app.use(express.json());

// Sirva arquivos estáticos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas
const usuarioRoutes = require("./routes/usuarioRoutes");
const eventoRoutes = require("./routes/eventoRoutes");
const projetoRoutes = require("./routes/projetoRoutes");
const authRoutes = require("./routes/authRoutes");
const doacaoRoutes = require("./routes/doacaoRoutes");

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/projetos", projetoRoutes);
app.use("/api/login", authRoutes);
app.use("/api/doacoes", doacaoRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
