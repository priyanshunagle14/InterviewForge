const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const { createRoomHandler, getRoomHandler } = require("../controllers/roomController");

router.post("/", requireAuth, createRoomHandler);
router.get("/:id", getRoomHandler);

module.exports = router;