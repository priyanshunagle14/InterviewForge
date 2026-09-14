const rooms = new Map();

function createRoom(roomId, ownerUserId = null) {
  const room = {
    roomId,
    ownerUserId,
    interviewerSocketId: null,
    candidates: [],
    participants: [],
    messages: [],
    tabSwitches: [],
    locked: false,
    chatMuted: false,
    ended: false,
    currentQuestion: null,
    code: "",
    language: "javascript",
    timer: { durationSeconds: null, startedAt: null, paused: false, pausedRemaining: null },
    createdAt: Date.now(),
  };
  rooms.set(roomId, room);
  return room;
}

function getRoom(roomId) {
  if (!roomId) return null;
  if (rooms.has(roomId)) {
    return rooms.get(roomId);
  }
  const lowerId = String(roomId).toLowerCase();
  for (const [key, value] of rooms.entries()) {
    if (key.toLowerCase() === lowerId) {
      return value;
    }
  }
  return null;
}

module.exports = { createRoom, getRoom };