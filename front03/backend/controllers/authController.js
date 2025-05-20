const db = require("../db");

exports.login = (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }
  db.query(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha],
    (err, results) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao autenticar usuário" });
      if (results.length === 0)
        return res.status(401).json({ erro: "Email ou senha inválidos" });
      // Verifica status do usuário
      if (results[0].status === 0) {
        return res.status(403).json({
          erro: "Usuário inativo. Entre em contato com o administrador.",
        });
      }
      // Retorna dados do usuário para o front salvar no localStorage
      const usuario = {
        id: results[0].id,
        nome: results[0].nome,
        tipo: results[0].tipo,
        email: results[0].email,
      };
      res.json({ mensagem: "Login realizado com sucesso", usuario });
    }
  );
};
