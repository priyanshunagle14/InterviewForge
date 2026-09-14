const { nanoid } = require("nanoid");
const { createRoom, getRoom } = require("../models/roomStore");
const Interview = require("../models/Interview");

async function createRoomHandler(req, res) {
  const roomId = `${nanoid(4)}-${nanoid(4)}`;
  createRoom(roomId, req.user.userId);

  try {
    await Interview.create({ roomId, interviewerUserId: req.user.userId });
  } catch (err) {
    console.error("Failed to save interview record:", err.message);
    // Don't fail the whole request over this — the live room still works via in-memory state
  }

  res.json({ roomId });
}

function getRoomHandler(req, res) {
  const room = getRoom(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json({ roomId: room.roomId || req.params.id, exists: true });
}


module.exports = { createRoomHandler, getRoomHandler };