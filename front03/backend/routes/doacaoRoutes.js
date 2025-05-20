const express = require("express");
const router = express.Router();
const doacaoController = require("../controllers/doacaoController");

router.get("/exportar-excel", doacaoController.exportarExcel);
router.get("/", doacaoController.listarDoacoes);
router.post("/", doacaoController.cadastrarDoacao);
router.get("/:id", doacaoController.buscarDoacaoPorId);
router.put("/:id", doacaoController.atualizarDoacao);
router.delete("/:id", doacaoController.deletarDoacao);

module.exports = router;
