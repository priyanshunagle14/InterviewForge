const Interview = require("../models/Interview");
const { getRoom } = require("../models/roomStore");
const { getQuestionById } = require("../models/questions");
const LANGUAGE_STARTERS = {
  javascript: "// Start coding here\nconsole.log(\"hello\");\n",
  python: "# Start coding here\nprint(\"hello\")\n",
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "hello" << endl;\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("hello");\n    }\n}\n',
};

function registerSocketHandlers(io, socket) {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://interview-forge-delta.vercel.app"
  ];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

  socket.on("join-room", async ({ roomId, role, name, userId }) => {
    const room = getRoom(roomId);

    if (!room) {
      socket.emit("join-error", { message: "Room not found" });
      return;
    }
    if (room.ended) {
      socket.emit("join-error", { message: "This interview has ended" });
      return;
    }

    if (role === "interviewer") {
      room.interviewerSocketId = socket.id;
    } else {
      room.candidates.push({
        socketId: socket.id,
        name,
      });
      // Save candidate to interview
      if (userId) {
        try {
          await Interview.findOneAndUpdate(
            { roomId },
            {
              candidateUserId: userId,
              candidateName: name,
            }
          );
        } catch (err) {
          console.error(err);
        }
      }
    }
    if (
      role === "interviewer" &&
      room.interviewerSocketId &&
      room.interviewerSocketId !== socket.id
    ) {
      socket.emit("join-error", {
        message: "Interviewer already connected."
      });
      return;
    }
    const alreadyInRoom = room.participants.some((p) => p.socketId === socket.id);
    if (!alreadyInRoom) {
      room.participants.push({ socketId: socket.id, name, role });
    }

    socket.join(roomId);

    socket.data.roomId = roomId;
    socket.data.role = role;
    socket.data.name = name;
    socket.data.userId = userId || null;

    if (role === "interviewer") {
      room.interviewerSocketId = socket.id;
    } else {
      room.candidates.push({
        socketId: socket.id,
        name,
      });

      if (userId) {
        await Interview.findOneAndUpdate(
          { roomId },
          {
            candidateUserId: userId,
            candidateName: name,
          }
        );
      }
    }

    room.participants.push({
      socketId: socket.id,
      name,
      role,
    });

    socket.emit("role-confirmed", { role, roomId });
    socket.emit("chat-history", { messages: room.messages });
    socket.emit("timer-update", room.timer);

    io.to(roomId).emit("activity", {
      message: `${name} joined as ${role}`,
      timestamp: Date.now(),
    });
    io.to(roomId).emit("participants-update", { participants: room.participants });
  });

  socket.on("code-change", ({ roomId, code }) => {
    const room = getRoom(roomId);
    if (!room || room.ended) return;
    if (room.locked && socket.data.role === "candidate") return;

    room.code = code;

    socket.to(roomId).emit("code-update", { code });
    Interview.findOneAndUpdate(
      { roomId },
      { finalCode: code }
    ).catch(console.error);
  });

  socket.on("toggle-lock", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;
    if (socket.data.role !== "interviewer") return;

    room.locked = !room.locked;
    io.to(roomId).emit("lock-changed", { locked: room.locked });
    io.to(roomId).emit("activity", {
      message: room.locked ? "Interviewer locked the editor" : "Interviewer unlocked the editor",
      timestamp: Date.now(),
    });
  });
  socket.on("toggle-mute-chat", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;
    if (socket.data.role !== "interviewer") return;

    room.chatMuted = !room.chatMuted;
    io.to(roomId).emit("chat-mute-changed", { chatMuted: room.chatMuted });
    io.to(roomId).emit("activity", {
      message: room.chatMuted ? "Interviewer muted candidate chat" : "Interviewer unmuted chat",
      timestamp: Date.now(),
    });
  });

  socket.on("end-interview", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;
    if (socket.data.role !== "interviewer") return;

    room.ended = true;
    io.to(roomId).emit("interview-ended", { timestamp: Date.now() });

    // Fire-and-forget DB update — don't block the live socket event on this
    const candidateName = room.participants.find((p) => p.role === "candidate")?.name || null;
    Interview.findOneAndUpdate(
      { roomId },
      {
        status: "ended",
        endedAt: new Date(),
        candidateName,
        questionTitle: room.currentQuestion?.title || null,
        language: room.language,
        finalCode: room.code,
      }
    ).catch((err) => console.error("Failed to finalize interview record:", err.message));
  });
  socket.on("select-question", ({ roomId, questionId }) => {
    const room = getRoom(roomId);
    if (!room) return;
    if (socket.data.role !== "interviewer") return; // only interviewer picks the question

    const question = getQuestionById(questionId);
    if (!question) return;

    room.currentQuestion = question;
    Interview.findOneAndUpdate(
      { roomId },
      {
        questionTitle: question.title
      }
    ).catch(console.error);

    io.to(roomId).emit("question-selected", { question });
    io.to(roomId).emit("code-update", { code: question.starterCode });
    io.to(roomId).emit("activity", {
      message: `Question set: ${question.title}`,
      timestamp: Date.now(),
    });
  });
  socket.on("create-question", ({ roomId, title, difficulty, description, starterCode }) => {
    const room = getRoom(roomId);
    if (!room) return;
    if (socket.data.role !== "interviewer") return;

    const question = {
      id: `custom-${Date.now()}`,
      title: title || "Untitled Question",
      difficulty: difficulty || "Medium",
      description: description || "",
      examples: [],
      constraints: [],
      starterCode: starterCode || LANGUAGE_STARTERS[room.language],
      testCases: [], // custom questions aren't auto-graded — same limitation as the tree question
    };

    room.currentQuestion = question;


    io.to(roomId).emit("question-selected", { question });
    io.to(roomId).emit("code-update", { code: question.starterCode });
    io.to(roomId).emit("activity", {
      message: `Custom question set: ${question.title}`,
      timestamp: Date.now(),
    });
  });

  socket.on("chat-message", ({ roomId, text }) => {
    const room = getRoom(roomId);
    if (!room || room.ended) return;
    if (room.chatMuted && socket.data.role === "candidate") return; // silently drop, same pattern as locked editor

    const message = {
      id: `${socket.id}-${Date.now()}`,
      name: socket.data.name,
      role: socket.data.role,
      text,
      timestamp: Date.now(),
    };

    room.messages.push(message);
    io.to(roomId).emit("chat-message", message);
  });

  socket.on("change-language", ({ roomId, language }) => {
    const room = getRoom(roomId);
    if (!room) return;

    room.language = language;
    const starter = LANGUAGE_STARTERS[language] || "";

    io.to(roomId).emit("language-changed", { language });
    io.to(roomId).emit("code-update", { code: starter });
    io.to(roomId).emit("activity", {
      message: `Language switched to ${language}`,
      timestamp: Date.now(),
    });
  });

  socket.on("tab-switch", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "candidate") return;

    io.to(roomId).emit("activity", {
      message: `⚠️ ${socket.data.name} switched away from the tab`,
      timestamp: Date.now(),
    });
  });

  socket.on("paste-attempt", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "candidate") return;

    io.to(roomId).emit("activity", {
      message: `⚠️ ${socket.data.name} attempted to paste into the editor`,
      timestamp: Date.now(),
    });
  });

  socket.on("copy-attempt", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "candidate") return;

    io.to(roomId).emit("activity", {
      message: `📋 ${socket.data.name} copied code from the editor`,
      timestamp: Date.now(),
    });
  });

  socket.on("remove-participant", ({ roomId, targetSocketId }) => {
    console.log("remove-participant received:", { roomId, targetSocketId, myRole: socket.data.role });
    const room = getRoom(roomId);
    if (!room) return;
    if (socket.data.role !== "interviewer") return; // only interviewer can remove
    if (targetSocketId === room.interviewerSocketId) return; // can't remove yourself

    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (!targetSocket) return;

    targetSocket.emit("removed-from-interview");
    targetSocket.disconnect(true); // force-disconnect that specific socket

    room.candidates = room.candidates.filter((c) => c.socketId !== targetSocketId);
    room.participants = room.participants.filter((p) => p.socketId !== targetSocketId);

    io.to(roomId).emit("participants-update", { participants: room.participants });
    io.to(roomId).emit("activity", {
      message: `Interviewer removed a participant`,
      timestamp: Date.now(),
    });
  });
  socket.on("start-timer", ({ roomId, durationSeconds }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "interviewer") return;

    room.timer = { durationSeconds, startedAt: Date.now(), paused: false, pausedRemaining: null };
    io.to(roomId).emit("timer-update", room.timer);
  });

  socket.on("pause-timer", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "interviewer" || !room.timer.startedAt) return;

    const elapsed = (Date.now() - room.timer.startedAt) / 1000;
    const remaining = Math.max(0, room.timer.durationSeconds - elapsed);

    room.timer = { ...room.timer, paused: true, pausedRemaining: remaining };
    io.to(roomId).emit("timer-update", room.timer);
  });

  socket.on("resume-timer", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "interviewer" || !room.timer.paused) return;

    room.timer = {
      durationSeconds: room.timer.pausedRemaining,
      startedAt: Date.now(),
      paused: false,
      pausedRemaining: null,
    };
    io.to(roomId).emit("timer-update", room.timer);
  });

  socket.on("extend-timer", ({ roomId, extraSeconds }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "interviewer" || !room.timer.startedAt) return;

    room.timer.durationSeconds += extraSeconds;
    io.to(roomId).emit("timer-update", room.timer);
    io.to(roomId).emit("activity", {
      message: `Interviewer extended the timer by ${extraSeconds / 60} min`,
      timestamp: Date.now(),
    });
  });

  socket.on("stop-timer", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "interviewer") return;

    room.timer = { durationSeconds: null, startedAt: null, paused: false, pausedRemaining: null };
    io.to(roomId).emit("timer-update", room.timer);
    io.to(roomId).emit("activity", {
      message: "Interviewer stopped the timer",
      timestamp: Date.now(),
    });
  });
  socket.on("fullscreen-exit", ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room || socket.data.role !== "candidate") return;

    io.to(roomId).emit("activity", {
      message: `⚠️ ${socket.data.name} exited fullscreen mode`,
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    const { roomId, role, name } = socket.data;
    if (!roomId) return;

    const room = getRoom(roomId);
    if (room) {
      if (role === "interviewer" && room.interviewerSocketId === socket.id) {
        room.interviewerSocketId = null;
      } else {
        room.candidates = room.candidates.filter((c) => c.socketId !== socket.id);
      }
      room.participants = room.participants.filter((p) => p.socketId !== socket.id);

      io.to(roomId).emit("participants-update", { participants: room.participants });
    }
    if (role === "interviewer") {
      room.ended = true;

      Interview.findOneAndUpdate(
        { roomId },
        {
          status: "ended",
          endedAt: new Date(),
        }
      ).catch(console.error);

      io.to(roomId).emit("interview-ended");
    }

    io.to(roomId).emit("activity", {
      message: `${name || "Someone"} left`,
      timestamp: Date.now(),
    });
  });
}

module.exports = registerSocketHandlers;