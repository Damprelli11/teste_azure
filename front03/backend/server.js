const express = require("express");
const app = express();
const path = require("path");
const usuarioRoutes = require("./routes/usuarioRoutes");
const projetoRoutes = require("./routes/projetoRoutes");
const eventoRoutes = require("./routes/eventoRoutes");
const doacaoRoutes = require("./routes/doacaoRoutes");
const sequelize = require("./models/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adicione esta linha para servir arquivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/projetos", projetoRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/doacoes", doacaoRoutes);

sequelize
  .authenticate()
  .then(() => console.log("Sequelize conectado ao banco de dados!"))
  .catch((err) => console.error("Erro ao conectar Sequelize:", err));

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
