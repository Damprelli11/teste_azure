const db = require('../db');

exports.listarUsuarios = (req, res) => {
  db.query("SELECT id, nome, email, tipo, telefone, rg, dataCadastro, status FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuários" });
    res.json(results);
  });
};

exports.cadastrarUsuario = (req, res) => {
  const { nome, email, senha, tipo, telefone, rg, status } = req.body;
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios" });
  }
  db.query(
    "INSERT INTO usuarios (nome, email, senha, tipo, telefone, rg, dataCadastro, status) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)",
    [nome, email, senha, tipo, telefone || null, rg || null, status !== undefined ? status : 1],
    (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
      res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    }
  );
};

exports.buscarUsuarioPorId = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id, nome, email, tipo, telefone, rg, dataCadastro, status FROM usuarios WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar usuário" });
      if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
      res.json(results[0]);
    }
  );
};

exports.atualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo, telefone, rg, status } = req.body;
  if (!nome || !email || !tipo) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios" });
  }
  let query, params;
  if (senha && senha.trim() !== "") {
    query = "UPDATE usuarios SET nome = ?, email = ?, senha = ?, tipo = ?, telefone = ?, rg = ?, status = ? WHERE id = ?";
    params = [nome, email, senha, tipo, telefone || null, rg || null, status !== undefined ? status : 1, id];
  } else {
    query = "UPDATE usuarios SET nome = ?, email = ?, tipo = ?, telefone = ?, rg = ?, status = ? WHERE id = ?";
    params = [nome, email, tipo, telefone || null, rg || null, status !== undefined ? status : 1, id];
  }
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  });
};

exports.deletarUsuario = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao deletar usuário" });
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  });
};
