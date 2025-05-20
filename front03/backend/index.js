const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configure sua conexão MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "11/09/2003",
  database: "instituto_criativo_db",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

// Rota de teste
app.get("/api/usuarios", (req, res) => {
  db.query("SELECT id, nome, email FROM usuarios", (err, results) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
    res.json(results);
  });
});

// Rota para cadastro de usuário
app.post("/api/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }
  db.query(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
      }
      res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    }
  );
});

// Rota de login
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }
  db.query(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha],
    (err, results) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao autenticar usuário" });
      }
      if (results.length === 0) {
        return res.status(401).json({ erro: "Email ou senha inválidos" });
      }
      res.json({ mensagem: "Login realizado com sucesso" });
    }
  );
});

// Buscar usuário por ID
app.get("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id, nome, email FROM usuarios WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao buscar usuário" });
      }
      if (results.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      res.json(results[0]);
    }
  );
});

// Atualizar usuário
app.put("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }
  db.query(
    "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
    [nome, email, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
      }
      res.json({ mensagem: "Usuário atualizado com sucesso!" });
    }
  );
});

// Deletar usuário
app.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao deletar usuário" });
    }
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  });
});

// Listar eventos
app.get("/api/eventos", (req, res) => {
  db.query("SELECT * FROM eventos", (err, results) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar eventos" });
    }
    res.json(results);
  });
});

// Buscar evento por ID
app.get("/api/eventos/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM eventos WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar evento" });
    }
    if (results.length === 0) {
      return res.status(404).json({ erro: "Evento não encontrado" });
    }
    res.json(results[0]);
  });
});

// Criar evento
app.post("/api/eventos", (req, res) => {
  const { titulo, descricao, data, imagem } = req.body;
  if (!titulo || !data) {
    return res.status(400).json({ erro: "Preencha os campos obrigatórios" });
  }
  db.query(
    "INSERT INTO eventos (titulo, descricao, data, imagem) VALUES (?, ?, ?, ?)",
    [titulo, descricao, data, imagem],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao cadastrar evento" });
      }
      res.status(201).json({ mensagem: "Evento cadastrado com sucesso!" });
    }
  );
});

// Atualizar evento
app.put("/api/eventos/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data, imagem } = req.body;
  if (!titulo || !data) {
    return res.status(400).json({ erro: "Preencha os campos obrigatórios" });
  }
  db.query(
    "UPDATE eventos SET titulo = ?, descricao = ?, data = ?, imagem = ? WHERE id = ?",
    [titulo, descricao, data, imagem, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao atualizar evento" });
      }
      res.json({ mensagem: "Evento atualizado com sucesso!" });
    }
  );
});

// Deletar evento
app.delete("/api/eventos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM eventos WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao deletar evento" });
    }
    res.json({ mensagem: "Evento deletado com sucesso!" });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
