const db = require("../db");
const path = require("path");

exports.listarEventos = (req, res) => {
  db.query("SELECT * FROM eventos ORDER BY data ASC", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar eventos" });
    res.json(results);
  });
};

exports.buscarEventoPorId = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM eventos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar evento" });
    if (results.length === 0)
      return res.status(404).json({ erro: "Evento não encontrado" });
    res.json(results[0]);
  });
};

exports.criarEvento = (req, res) => {
  let imagem = "";
  if (req.file) {
    imagem = "/uploads/" + req.file.filename;
  } else if (req.body.imagem) {
    imagem = req.body.imagem;
  }
  const {
    titulo,
    descricao,
    data,
    capacidade_total,
    endereco,
    cidade,
    estado,
  } = req.body;
  if (!titulo || !data) {
    return res.status(400).json({ erro: "Preencha os campos obrigatórios" });
  }
  db.query(
    "INSERT INTO eventos (titulo, descricao, data, imagem, capacidade_total, participantes, endereco, cidade, estado) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)",
    [
      titulo,
      descricao,
      data,
      imagem,
      capacidade_total || 0,
      endereco,
      cidade,
      estado,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao cadastrar evento" });
      res.status(201).json({ mensagem: "Evento cadastrado com sucesso!" });
    }
  );
};

exports.atualizarEvento = (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descricao,
    data,
    capacidade_total,
    endereco,
    cidade,
    estado,
  } = req.body;
  if (!titulo || !data) {
    return res.status(400).json({ erro: "Preencha os campos obrigatórios" });
  }
  let imagem;
  if (req.file) {
    imagem = "/uploads/" + req.file.filename;
  } else if (req.body.imagem) {
    imagem = req.body.imagem;
  }
  let query, params;
  if (typeof imagem !== "undefined") {
    query =
      "UPDATE eventos SET titulo = ?, descricao = ?, data = ?, imagem = ?, capacidade_total = ?, endereco = ?, cidade = ?, estado = ? WHERE id = ?";
    params = [
      titulo,
      descricao,
      data,
      imagem,
      capacidade_total || 0,
      endereco,
      cidade,
      estado,
      id,
    ];
  } else {
    query =
      "UPDATE eventos SET titulo = ?, descricao = ?, data = ?, capacidade_total = ?, endereco = ?, cidade = ?, estado = ? WHERE id = ?";
    params = [
      titulo,
      descricao,
      data,
      capacidade_total || 0,
      endereco,
      cidade,
      estado,
      id,
    ];
  }
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar evento" });
    res.json({ mensagem: "Evento atualizado com sucesso!" });
  });
};

exports.inscreverParticipante = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE eventos SET participantes = participantes + 1 WHERE id = ? AND (capacidade_total = 0 OR participantes < capacidade_total)",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao inscrever participante" });
      if (result.affectedRows === 0)
        return res
          .status(400)
          .json({ erro: "Evento lotado ou não encontrado" });
      res.json({ mensagem: "Inscrição realizada com sucesso!" });
    }
  );
};

exports.cancelarInscricao = (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE eventos SET participantes = IF(participantes > 0, participantes - 1, 0) WHERE id = ?",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao cancelar inscrição" });
      if (result.affectedRows === 0)
        return res.status(400).json({ erro: "Evento não encontrado" });
      res.json({ mensagem: "Inscrição cancelada." });
    }
  );
};

exports.deletarEvento = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM eventos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao deletar evento" });
    res.json({ mensagem: "Evento deletado com sucesso!" });
  });
};
