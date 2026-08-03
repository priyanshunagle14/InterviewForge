import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import Card from "../components/Common/Card";
import Badge from "../components/Common/Badge";
import Editor from "@monaco-editor/react";
import Button from "../components/Common/Button";
import QuestionPanel from "../components/Question/QuestionPanel";
import ParticipantsList from "../components/Participants/ParticipantsList";
import ChatPanel from "../components/Chat/ChatPanel";
import ConsolePanel from "../components/Console/ConsolePanel";
import TimerPanel from "../components/Timer/TimerPanel";
import NotesPanel from "../components/Notes/NotesPanel";
import ScorecardForm from "../components/Scorecard/ScorecardForm";
import ConfirmModal from "../components/Common/ConfirmModal";
import { downloadTranscript } from "../utils/downloadTranscript";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";


export default function InterviewRoom() {
  const showToast = useToast();
  const { user } = useAuth();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  const role = searchParams.get("role") === "interviewer" ? "interviewer" : "candidate";
  const nameFromUrl = searchParams.get("name");

  const [name] = useState(nameFromUrl || `Guest-${Math.floor(Math.random() * 1000)}`);
  const [status, setStatus] = useState("connecting");
  const [confirmedRole, setConfirmedRole] = useState(null);
  const [activity, setActivity] = useState([]);
  const [code, setCode] = useState("// Start coding here\n");
  const [locked, setLocked] = useState(false);
  const [question, setQuestion] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [chatMuted, setChatMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const navigate = useNavigate();
  const [left, setLeft] = useState(false);
  const [timer, setTimer] = useState({ durationSeconds: null, startedAt: null, paused: false, pausedRemaining: null });
  const [confirmModal, setConfirmModal] = useState(null); // null | { type, targetId? }
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("join-room", { roomId, role, name, userId: user?.id || null });
    });
    socket.on("timer-update", (timerData) => {
      setTimer(timerData);
    });

    socket.on("role-confirmed", ({ role }) => setConfirmedRole(role));

    socket.on("join-error", () => setStatus("error"));

    socket.on("activity", ({ message, timestamp }) => {
      setActivity((prev) => [...prev, { message, timestamp }]);
    });
    socket.on("code-update", ({ code }) => {
      setCode(code);
    });
    socket.on("lock-changed", ({ locked }) => {
      setLocked(locked);
      showToast(locked ? "Editor locked" : "Editor unlocked", "info");
    });
    socket.on("question-selected", ({ question }) => {
      setQuestion(question);
      showToast(`Question set: ${question.title}`, "success");
    });
    socket.on("participants-update", ({ participants }) => {
      const unique = participants.filter(
        (p, index, self) => index === self.findIndex((t) => t.socketId === p.socketId)
      );
      setParticipants(unique);
    });
    socket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chat-history", ({ messages }) => {
      setMessages(messages);
    });
    socket.on("chat-mute-changed", ({ muted }) => {
      setChatMuted(muted);
    });
    socket.on("language-changed", ({ language }) => {
      setLanguage(language);
      showToast(`Language switched to ${language}`, "info");
    });
    socket.on("interview-ended", () => {
      console.log("🛑 end‑interview received for", roomId);

      setEnded(true);
    });
    socket.on("removed-from-interview", () => {
      setLeft(true); // reuse the same "thanks for joining" screen, since being removed also ends their session
    });


    return () => {
      socket.off("connect");
      socket.off("role-confirmed");
      socket.off("timer-update");
      socket.off("join-error");
      socket.off("activity");
      socket.off("code-update");
      socket.off("lock-changed");
      socket.off("question-selected");
      socket.off("participants-update");
      socket.off("chat-message");
      socket.off("chat-history");
      socket.off("chat-mute-changed");
      socket.off("language-changed");
      socket.off("interview-ended");
      socket.off("removed-from-interview");
      socket.disconnect();
    };
  }, [roomId, role, name]);

  useEffect(() => {
    if (confirmedRole !== "candidate") return; // only watch the candidate

    function handleVisibilityChange() {
      if (document.hidden) {
        socket.emit("tab-switch", { roomId, role: roleRef.current });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [confirmedRole, roomId]);

  const roleRef = useRef(confirmedRole);
  useEffect(() => {
    roleRef.current = confirmedRole;
  }, [confirmedRole]);

  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  // Fullscreen exit detection — must be top-level (Rules of Hooks)
  useEffect(() => {
    function handleFullscreenChange() {
      const full = !!document.fullscreenElement;
      setIsFullscreen(full);
      if (!full && confirmedRole === "candidate") {
        socket.emit("fullscreen-exit", { roomId });
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [confirmedRole, roomId]);

  if (status === "connecting")
    return <div className="min-h-screen flex items-center justify-center text-dim">Connecting…</div>;
  if (status === "error")
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-400">Could not join room. Please check the Room ID and try again.</p>
        <Button variant="secondary" onClick={() => navigate("/join")}>
          Try Again
        </Button>
      </div>
    );
  if (ended) {
    if (confirmedRole === "interviewer") {
      return (
        <div className="min-h-screen flex items-center justify-center px-5">
          <div className="flex flex-col items-center gap-4">
            <ScorecardForm
              roomId={roomId}
              candidateName={participants.find((p) => p.role === "candidate")?.name}
              questionTitle={question?.title}
            />
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handleDownloadTranscript}>Download Transcript</Button>
              <Button variant="secondary" onClick={() => navigate("/")}>Back to Home</Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <h1 className="text-2xl font-mono">Interview ended</h1>
        <p className="text-dim text-sm">This session is now closed.</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }
  if (left)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-mono">Thanks for joining!</h1>
        <p className="text-dim text-sm">Your interview session has ended.</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );


  const accentBorder = confirmedRole === "interviewer" ? "border-t-interviewer" : "border-t-candidate";

  function handleToggleLock() {
    socket.emit("toggle-lock", { roomId });
  }
  function handleCodeChange(value) {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  }
  function handleSelectQuestion(questionId) {
    socket.emit("select-question", { roomId, questionId });
  }
  function handleCreateQuestion({ title, difficulty, description, starterCode }) {
    socket.emit("create-question", { roomId, title, difficulty, description, starterCode });
  }
  function handleSendMessage(text) {
    socket.emit("chat-message", { roomId, text });
  }
  function handleToggleMuteChat() {
    socket.emit("toggle-mute-chat", { roomId });
  }
  function handleLanguageChange(lang) {
    socket.emit("change-language", { roomId, language: lang });
  }
  function handleEndInterview() {
    if (confirmedRole === "interviewer") {
      setConfirmModal({ type: "end-interview" });
    } else {
      socket.emit("end-interview", { roomId });
    }
  }

  function handleLeaveInterview() {
    setConfirmModal({ type: "leave-interview" });
  }

  function handleRemoveParticipant(targetSocketId) {
    setConfirmModal({ type: "remove-participant", targetId: targetSocketId });
  }

  function handleStartTimer(durationSeconds) {
    socket.emit("start-timer", { roomId, durationSeconds });
  }
  function handlePauseTimer() {
    socket.emit("pause-timer", { roomId });
  }
  function handleResumeTimer() {
    socket.emit("resume-timer", { roomId });
  }
  function handleExtendTimer(extraSeconds) {
    socket.emit("extend-timer", { roomId, extraSeconds });
  }
  function handleStopTimer() {
    setConfirmModal({ type: "stop-timer" });
  }

  function handleConfirmModalAction() {
    if (confirmModal?.type === "end-interview") {
      socket.emit("end-interview", { roomId });
    } else if (confirmModal?.type === "leave-interview") {
      setLeft(true);
    } else if (confirmModal?.type === "remove-participant") {
      socket.emit("remove-participant", { roomId, targetSocketId: confirmModal.targetId });
    } else if (confirmModal?.type === "stop-timer") {
      socket.emit("stop-timer", { roomId });
    }
    setConfirmModal(null);
  }

  function handleDownloadTranscript() {
    downloadTranscript({
      roomId,
      candidateName: participants.find((p) => p.role === "candidate")?.name,
      question,
      code,
      language,
      messages,
      activity,
    });
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg">
      {/* Accent bar */}
      <div className={`h-0.5 shrink-0 ${confirmedRole === "interviewer" ? "bg-interviewer" : "bg-candidate"}`} />

      {/* Top navbar */}
      <div className="h-14 shrink-0 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-5 gap-4">
        {/* Left: brand + room ID */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-mono font-bold text-sm text-white">InterviewForge</span>
          <div className="flex items-center gap-2 bg-bg border border-border rounded-lg px-3 py-1.5">
            <span className="font-mono text-xs text-dim">Room</span>
            <span className="font-mono text-xs text-white">{roomId}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(roomId); showToast("Room ID copied", "success"); }}
              className="text-dim hover:text-white transition-colors ml-1 text-xs"
              title="Copy room ID"
            >
              ⎘
            </button>
          </div>
        </div>

        {/* Center: timer */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <span className="text-dim text-xs">⏱</span>
          <TimerPanel
            role={confirmedRole}
            timer={timer}
            onStart={handleStartTimer}
            onPause={handlePauseTimer}
            onResume={handleResumeTimer}
            onExtend={handleExtendTimer}
            onStop={handleStopTimer}
            inline
          />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadTranscript}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-border text-dim hover:text-white transition-colors flex items-center gap-1.5"
          >
            ↓ Transcript
          </button>
          {confirmedRole === "candidate" && !isFullscreen && (
            <button
              onClick={() => document.documentElement.requestFullscreen()}
              className="text-xs px-3 py-1.5 rounded-lg bg-candidate/15 text-candidate border border-candidate/30"
            >
              Fullscreen
            </button>
          )}
          {confirmedRole === "candidate" && (
            <button
              onClick={handleLeaveInterview}
              className="text-xs px-3 py-1.5 rounded-lg bg-surface text-dim border border-border hover:text-white"
            >
              Leave
            </button>
          )}
          {confirmedRole === "interviewer" && (
            <button
              onClick={handleEndInterview}
              className="text-xs px-4 py-1.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 active:scale-95 transition-all"
            >
              End Interview
            </button>
          )}
          <Badge tone={confirmedRole || "candidate"}>
            {confirmedRole ? confirmedRole.toUpperCase() + " MODE" : "…"}
          </Badge>
          <span className="text-xs text-dim hidden lg:block">
            Signed in as <span className="text-white">{name}</span>
          </span>
        </div>
      </div>

      {/* Body: three columns */}
      <div className="flex flex-1 overflow-hidden">

        {/* Column 1: Sidebar (Participants + Chat + Notes) */}
        <div className="w-72 shrink-0 flex flex-col border-r border-border overflow-y-auto">
          {/* Participants */}
          <div className="p-4 border-b border-border">
            <ParticipantsList
              participants={participants}
              mySocketId={socket.id}
              role={confirmedRole}
              onRemove={handleRemoveParticipant}
            />
          </div>

          {/* Chat */}
          <div className="p-4 border-b border-border flex-1">
            <ChatPanel
              messages={messages}
              onSend={handleSendMessage}
              mySocketId={socket.id}
              role={confirmedRole}
              chatMuted={chatMuted}
              onToggleMute={handleToggleMuteChat}
            />
          </div>

          {/* Private Notes (interviewer only) */}
          {confirmedRole === "interviewer" && (
            <div className="p-4">
              <NotesPanel />
            </div>
          )}
        </div>

        {/* Column 2: Activity Feed + Question Panel + Invite */}
        <div className="w-96 shrink-0 flex flex-col border-r border-border overflow-y-auto">
          {/* Activity Feed */}
          <div className="border-b border-border">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <span className="text-candidate text-xs">◉</span>
              <h3 className="font-mono text-xs text-dim tracking-widest">ACTIVITY FEED</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3 max-h-48 overflow-y-auto">
              {activity.length === 0 && (
                <div className="flex items-center gap-2 text-dim text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  Nothing yet — activity will appear here as the interview progresses.
                </div>
              )}
              {activity.map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-candidate shrink-0" />
                    <span className="text-sm">{a.message}</span>
                  </div>
                  <span className="text-dim text-xs shrink-0">
                    {new Date(a.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Question Panel */}
          <div className="flex-1 border-b border-border overflow-y-auto">
            <QuestionPanel
              role={confirmedRole}
              question={question}
              onSelectQuestion={handleSelectQuestion}
              onCreateQuestion={handleCreateQuestion}
            />
          </div>

          {/* Invite link (interviewer only) */}
          {confirmedRole === "interviewer" && (
            <div className="p-4 text-sm text-dim shrink-0">
              <p className="mb-2 text-xs">Invite the candidate:</p>
              <div className="bg-bg border border-border rounded-lg px-3 py-2 font-mono text-xs text-white flex items-center justify-between gap-2">
                <span className="truncate">{window.location.origin}/join?roomId={roomId}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/join?roomId=${roomId}`); showToast("Invite link copied", "success"); }}
                  className="text-dim hover:text-white shrink-0 text-xs"
                >
                  ⎘ Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Editor + Console */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Editor header */}
          <div className="px-4 py-2.5 border-b border-border bg-surface/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-bg border border-border rounded px-2.5 py-1">
                <span className="font-mono text-xs text-white">solution</span>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={confirmedRole !== "interviewer"}
                className="bg-bg border border-border rounded px-2 py-1 text-xs text-white outline-none focus:border-interviewer disabled:opacity-60 cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border ${locked ? "border-interviewer/40 text-interviewer bg-interviewer/10" : "border-candidate/40 text-candidate bg-candidate/10"}`}>
                <span>{locked ? "🔒" : "🔓"}</span>
                <span>{locked ? "Locked" : "Unlocked"}</span>
              </div>
              {confirmedRole === "interviewer" && (
                <button
                  onClick={handleToggleLock}
                  className="text-xs px-3 py-1.5 rounded border border-border text-dim hover:text-white transition-colors flex items-center gap-1.5"
                >
                  {locked ? "🔓 Unlock editor" : "🔒 Lock editor"}
                </button>
              )}
            </div>
          </div>

          {/* Monaco Editor — takes remaining height */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              onMount={(editor, monaco) => {
                const domNode = editor.getDomNode();
                editor.onKeyDown((e) => {
                  if (roleRef.current !== "candidate") return;
                  const isPaste = (e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV;
                  if (isPaste) {
                    e.preventDefault();
                    e.stopPropagation();
                    socket.emit("paste-attempt", { roomId });
                  }
                });
                domNode?.addEventListener("paste", (e) => {
                  if (roleRef.current === "candidate") {
                    e.preventDefault();
                    e.stopPropagation();
                    socket.emit("paste-attempt", { roomId });
                  }
                }, true);
                domNode?.addEventListener("copy", () => {
                  if (roleRef.current === "candidate") socket.emit("copy-attempt", { roomId });
                }, true);
              }}
              options={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 14,
                minimap: { enabled: false },
                readOnly: locked && confirmedRole === "candidate",
                contextMenu: confirmedRole !== "candidate",
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Console */}
          <div className="shrink-0 border-t border-border">
            <ConsolePanel code={code} language={language} />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmModal}
        title={
          confirmModal?.type === "end-interview" ? "End Interview?" :
            confirmModal?.type === "leave-interview" ? "Leave Interview?" :
              confirmModal?.type === "remove-participant" ? "Remove Participant?" :
                "Stop Timer?"
        }
        message={
          confirmModal?.type === "end-interview" ? "This will end the interview for both participants. This can't be undone." :
            confirmModal?.type === "leave-interview" ? "You'll be disconnected from this interview." :
              confirmModal?.type === "remove-participant" ? "This will remove them from the interview immediately." :
                "This will reset the timer back to zero."
        }
        confirmLabel={
          confirmModal?.type === "end-interview" ? "End Interview" :
            confirmModal?.type === "leave-interview" ? "Leave" :
              confirmModal?.type === "remove-participant" ? "Remove" : "Stop"
        }
        danger={confirmModal?.type === "end-interview" || confirmModal?.type === "remove-participant"}
        onConfirm={handleConfirmModalAction}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
}