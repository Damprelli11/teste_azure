const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer-config");
const eventController = require("../controllers/event.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post(
  "/",
  verifyToken,
  upload.single("imagem"),
  eventController.createEvent
);
router.get("/", eventController.getEvents);
router.put(
  "/:id",
  verifyToken,
  upload.single("imagem"),
  eventController.updateEvent
);
router.delete("/:id", verifyToken, eventController.deleteEvent);

module.exports = router;
