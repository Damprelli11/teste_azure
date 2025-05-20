const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");
const multer = require("multer");
const path = require("path");

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    // Nome único para evitar conflitos
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", eventoController.listarEventos);
// Altere para aceitar upload de imagem
router.post("/", upload.single("imagem"), eventoController.criarEvento);
router.get("/:id", eventoController.buscarEventoPorId);
// Altere para aceitar upload de imagem
router.put("/:id", upload.single("imagem"), eventoController.atualizarEvento);
router.post("/:id/inscrever", eventoController.inscreverParticipante);
// Novo endpoint para cancelar inscrição
router.post("/:id/cancelar-inscricao", eventoController.cancelarInscricao);
router.delete("/:id", eventoController.deletarEvento);

module.exports = router;
