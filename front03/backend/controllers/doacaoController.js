const db = require("../db");

exports.listarDoacoes = (req, res) => {
  db.query("SELECT * FROM doacoes", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar doações" });
    res.json(results);
  });
};

exports.cadastrarDoacao = (req, res) => {
  const { usuario_id, nome_completo, email, valor, observacoes } = req.body;
  if (!usuario_id || !nome_completo || !email || !valor) {
    return res
      .status(400)
      .json({ erro: "Preencha todos os campos obrigatórios" });
  }
  db.query(
    "INSERT INTO doacoes (usuario_id, nome_completo, email, valor, observacoes) VALUES (?, ?, ?, ?, ?)",
    [usuario_id, nome_completo, email, valor, observacoes],
    (err, result) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao registrar doação" });
      res.status(201).json({ mensagem: "Doação registrada com sucesso!" });
    }
  );
};

exports.buscarDoacaoPorId = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM doacoes WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar doação" });
    if (results.length === 0)
      return res.status(404).json({ erro: "Doação não encontrada" });
    res.json(results[0]);
  });
};

exports.atualizarDoacao = (req, res) => {
  const { id } = req.params;
  const { valor, observacoes } = req.body;
  if (!valor) {
    return res.status(400).json({ erro: "Preencha o valor da doação" });
  }
  db.query(
    "UPDATE doacoes SET valor = ?, observacoes = ? WHERE id = ?",
    [valor, observacoes, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao atualizar doação" });
      res.json({ mensagem: "Doação atualizada com sucesso!" });
    }
  );
};

exports.deletarDoacao = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM doacoes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao deletar doação" });
    res.json({ mensagem: "Doação deletada com sucesso!" });
  });
};

exports.exportarExcel = (req, res) => {
  const ExcelJS = require("exceljs");
  db.query(
    "SELECT u.dataCadastro as 'dataCadastro', u.telefone as 'telefone', u.tipo as 'tipo', d.nome_completo as 'nome_completo', d.email as 'email', d.valor as 'valor', d.observacoes as 'observacoes' FROM doacoes as d LEFT JOIN usuarios as u ON d.usuario_id = u.id",
    (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar doações" });

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Doacoes");
      sheet.columns = [
        { header: "Data", key: "dataCadastro", width: 20 },
        { header: "Nome Completo", key: "nome_completo", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Telefone", key: "telefone", width: 20 },
        { header: "Tipo de Usuário", key: "tipo", width: 20 },
        { header: "Valor", key: "valor", width: 12 },
        { header: "Observações", key: "observacoes", width: 40 },
      ];
      results.forEach((row) => sheet.addRow(row));
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=relatorio_doacoes.xlsx"
      );
      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          res.end(buffer);
        })
        .catch((e) => {
          res.status(500).json({ erro: "Erro ao gerar arquivo Excel" });
        });
    }
  );
};
