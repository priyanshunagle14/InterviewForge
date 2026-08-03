import { useEffect, useState } from "react";
import Card from "../Common/Card";
import Badge from "../Common/Badge";
import Button from "../Common/Button";

export default function QuestionPanel({ role, question, onSelectQuestion, onCreateQuestion }) {
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [mode, setMode] = useState("select");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [description, setDescription] = useState("");
  const [starterCode, setStarterCode] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/questions")
      .then((res) => res.json())
      .then(setAvailableQuestions)
      .catch(() => setAvailableQuestions([]));
  }, []);

  function handleCreate() {
    if (!title.trim() || !description.trim()) return;
    onCreateQuestion({ title, difficulty, description, starterCode });
    setTitle(""); setDescription(""); setStarterCode("");
    setMode("select");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-candidate text-xs">◉</span>
          <h3 className="font-mono text-xs text-dim tracking-widest">PROBLEM SPECIFICATION</h3>
        </div>

        {role === "interviewer" && (
          <div className="flex items-center border border-border rounded-lg overflow-hidden text-xs">
            <button
              onClick={() => setMode("select")}
              className={`px-3 py-1.5 transition-colors ${mode === "select" ? "bg-interviewer text-bg font-semibold" : "text-dim hover:text-white"}`}
            >
              Pick Existing
            </button>
            <button
              onClick={() => setMode("create")}
              className={`px-3 py-1.5 transition-colors border-l border-border ${mode === "create" ? "bg-interviewer text-bg font-semibold" : "text-dim hover:text-white"}`}
            >
              + Custom
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {role === "interviewer" && mode === "select" && (
          <div className="mb-4">
            <p className="font-mono text-xs text-dim tracking-widest mb-2">SELECT ACTIVE PROBLEM</p>
            <select
              onChange={(e) => onSelectQuestion(e.target.value)}
              defaultValue=""
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-interviewer appearance-none cursor-pointer"
            >
              <option value="" disabled>Choose a question from bank...</option>
              {availableQuestions.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
        )}

        {role === "interviewer" && mode === "create" && (
          <div className="flex flex-col gap-3">
            <input
              placeholder="Question title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-interviewer placeholder:text-dim"
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-interviewer"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-interviewer resize-none placeholder:text-dim"
            />
            <textarea
              placeholder="Starter code (optional)"
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              rows={2}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-interviewer resize-none placeholder:text-dim"
            />
            <Button onClick={handleCreate}>Set Question</Button>
          </div>
        )}

        {!question && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-dim text-lg">
              ?
            </div>
            <p className="text-dim text-sm text-center">
              {role === "interviewer"
                ? "No question selected yet — pick one\nabove or write your own."
                : "Waiting for the interviewer to\nselect a question…"}
            </p>
          </div>
        )}

        {question && (
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-2">
              <h4 className="font-mono font-bold text-base">{question.title}</h4>
              <Badge tone={question.difficulty === "Easy" ? "candidate" : "interviewer"}>
                {question.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-dim leading-relaxed">{question.description}</p>
            {question.examples?.length > 0 && (
              <div>
                <p className="font-mono text-xs text-dim mb-1">EXAMPLE</p>
                <pre className="bg-bg border border-border rounded-lg p-3 text-xs whitespace-pre-wrap">
                  {question.examples[0]}
                </pre>
              </div>
            )}
            {question.constraints?.length > 0 && (
              <ul className="text-xs text-dim list-disc pl-4 space-y-1">
                {question.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}