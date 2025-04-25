const db = require("../models/db");

exports.createEvent = (req, res) => {
  const { titulo, descricao, data } = req.body;
  const imagem = req.file ? req.file.filename : null;

  if (!titulo || !data) {
    return res.status(400).json({ message: "Título e data são obrigatórios." });
  }

  const query =
    "INSERT INTO eventos (titulo, descricao, data, imagem) VALUES (?, ?, ?, ?)";
  db.query(query, [titulo, descricao, data, imagem], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res
      .status(201)
      .json({ message: "Evento criado com sucesso!", id: result.insertId });
  });
};

exports.getEvents = (req, res) => {
  const query = "SELECT * FROM eventos";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getFirstEvent = (req, res) => {
  const query = "SELECT * FROM eventos ORDER BY id ASC LIMIT 1";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Nenhum evento encontrado." });
    res.json(results[0]);
  });
};

exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data } = req.body;
  const imagem = req.file ? req.file.filename : null;

  let query = "UPDATE eventos SET titulo = ?, descricao = ?, data = ?";
  const values = [titulo, descricao, data];

  if (imagem) {
    query += ", imagem = ?";
    values.push(imagem);
  }
  query += " WHERE id = ?";
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Evento não encontrado." });
    res.json({ message: "Evento atualizado com sucesso!" });
  });
};

exports.deleteEvent = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM eventos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Evento não encontrado." });
    res.json({ message: "Evento excluído com sucesso!" });
  });
};
