const db = require("../models/db");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
  const query = "SELECT id, nome, email FROM usuarios";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ message: "Nome, email e senha são obrigatórios." });
  }

  const hashedSenha = await bcrypt.hash(senha, 10);
  const query = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  db.query(query, [nome, email, hashedSenha], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM usuarios WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuário não encontrado." });
    res.json({ message: "Usuário excluído com sucesso!" });
  });
};
