const db = require("../db");

function formatHorario(horario) {
  // Aceita "HH:mm" ou "HH:mm:ss" e retorna "HH:mm:ss"
  if (!horario) return null;
  if (/^\d{2}:\d{2}$/.test(horario)) return horario + ":00";
  if (/^\d{2}:\d{2}:\d{2}$/.test(horario)) return horario;
  return null;
}

exports.listarProjetos = (req, res) => {
  db.query(
    `SELECT projetos.*, usuarios.nome as responsavelNome 
     FROM projetos 
     LEFT JOIN usuarios ON projetos.responsavelId = usuarios.id`,
    (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar projetos" });
      res.json(results);
    }
  );
};

exports.buscarProjetoPorId = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT projetos.*, usuarios.nome as responsavelNome 
     FROM projetos 
     LEFT JOIN usuarios ON projetos.responsavelId = usuarios.id
     WHERE projetos.id = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar projeto" });
      if (results.length === 0)
        return res.status(404).json({ erro: "Projeto não encontrado" });
      res.json(results[0]);
    }
  );
};

exports.criarProjeto = (req, res) => {
  // Adiciona suporte à imagem
  let imagem = "";
  if (req.file) {
    imagem = "/uploads/" + req.file.filename;
  } else if (req.body && req.body.imagem) {
    imagem = req.body.imagem;
  }
  // Garante que req.body existe
  const body = req.body || {};
  const {
    titulo,
    descricao,
    categoria,
    dataInicio,
    dataFim,
    horario,
    endereco,
    responsavelId,
  } = body;
  if (!titulo || !dataInicio || !horario || !endereco) {
    return res.status(400).json({ erro: "Preencha os campos obrigatórios" });
  }
  const horarioFormatado = formatHorario(horario);
  db.query(
    "INSERT INTO projetos (titulo, descricao, categoria, dataInicio, dataFim, horario, endereco, responsavelId, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      titulo,
      descricao,
      categoria,
      dataInicio,
      dataFim,
      horarioFormatado,
      endereco,
      responsavelId,
      imagem,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao cadastrar projeto" });
      res.status(201).json({ mensagem: "Projeto cadastrado com sucesso!" });
    }
  );
};

exports.atualizarProjeto = (req, res) => {
  const { id } = req.params;
  let imagem;
  if (req.file) {
    imagem = "/uploads/" + req.file.filename;
  } else if (req.body && req.body.imagem) {
    imagem = req.body.imagem;
  }
  // Garante que req.body existe
  const body = req.body || {};
  const {
    titulo,
    descricao,
    categoria,
    dataInicio,
    dataFim,
    horario,
    endereco,
    responsavelId,
  } = body;
  if (!titulo || !dataInicio || !horario || !endereco) {
    return res.status(400).json({ erro: "Preencha os campos obrigatórios" });
  }
  const horarioFormatado = formatHorario(horario);
  let query, params;
  if (typeof imagem !== "undefined") {
    query =
      "UPDATE projetos SET titulo = ?, descricao = ?, categoria = ?, dataInicio = ?, dataFim = ?, horario = ?, endereco = ?, responsavelId = ?, imagem = ? WHERE id = ?";
    params = [
      titulo,
      descricao,
      categoria,
      dataInicio,
      dataFim,
      horarioFormatado,
      endereco,
      responsavelId,
      imagem,
      id,
    ];
  } else {
    query =
      "UPDATE projetos SET titulo = ?, descricao = ?, categoria = ?, dataInicio = ?, dataFim = ?, horario = ?, endereco = ?, responsavelId = ? WHERE id = ?";
    params = [
      titulo,
      descricao,
      categoria,
      dataInicio,
      dataFim,
      horarioFormatado,
      endereco,
      responsavelId,
      id,
    ];
  }
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar projeto" });
    res.json({ mensagem: "Projeto atualizado com sucesso!" });
  });
};

exports.deletarProjeto = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM projetos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao deletar projeto" });
    res.json({ mensagem: "Projeto deletado com sucesso!" });
  });
};

exports.listarUsuariosParaProjeto = (req, res) => {
  db.query("SELECT id, nome FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuários" });
    res.json(results);
  });
};
