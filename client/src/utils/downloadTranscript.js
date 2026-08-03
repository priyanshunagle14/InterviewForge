export function downloadTranscript({ roomId, candidateName, question, code, language, messages, activity }) {
  const lines = [
    `InterviewForge — Interview Transcript`,
    `Room: ${roomId}`,
    `Candidate: ${candidateName || "Unknown"}`,
    `Date: ${new Date().toLocaleString()}`,
    ``,
    `=== QUESTION ===`,
    question ? `${question.title} (${question.difficulty})` : "No question was set",
    question?.description || "",
    ``,
    `=== FINAL CODE (${language}) ===`,
    code || "(empty)",
    ``,
    `=== CHAT LOG ===`,
    messages.length
      ? messages.map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.name} (${m.role}): ${m.text}`).join("\n")
      : "(no messages)",
    ``,
    `=== ACTIVITY LOG ===`,
    activity.length
      ? activity.map((a) => `[${new Date(a.timestamp).toLocaleTimeString()}] ${a.message}`).join("\n")
      : "(no activity)",
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `interview-transcript-${roomId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
