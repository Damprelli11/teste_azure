const express = require("express");
const router = express.Router();
const projetoController = require("../controllers/projetoController");
const multer = require("multer");
const path = require("path");

// Configuração do Multer para projetos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", projetoController.listarProjetos);
// Suporte a upload de imagem
router.post("/", upload.single("imagem"), projetoController.criarProjeto);
router.get("/usuarios", projetoController.listarUsuariosParaProjeto);
router.get("/:id", projetoController.buscarProjetoPorId);
// Suporte a upload de imagem
router.put("/:id", upload.single("imagem"), projetoController.atualizarProjeto);
router.delete("/:id", projetoController.deletarProjeto);

module.exports = router;
