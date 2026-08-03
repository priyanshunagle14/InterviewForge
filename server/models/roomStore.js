const rooms = new Map();

function createRoom(roomId, ownerUserId = null) {
  const room = {
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
};

function getRoom(roomId) {
  return rooms.get(roomId);
}

module.exports = { createRoom, getRoom };