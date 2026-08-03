import { useState } from "react";
import { useToast } from "../../context/ToastContext";

export default function ConsolePanel({ code, language }) {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const showToast = useToast();

  async function handleRun() {
    setRunning(true);
    setOutput(null);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) { setError("Execution failed."); setRunning(false); return; }
      const data = await res.json();
      setOutput(data);
    } catch {
      setError("Could not reach the server.");
      showToast("Could not reach the server", "error");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Console header */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-surface/50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-dim text-xs">&gt;_</span>
          <span className="font-mono text-xs text-dim tracking-widest">CONSOLE</span>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-candidate text-bg text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <span>▶</span>
          {running ? "Running…" : "Run Code"}
        </button>
      </div>

      {/* Output */}
      <div className="px-4 py-3 font-mono text-xs min-h-[80px] max-h-40 overflow-y-auto bg-bg/30">
        {!output && !running && !error && (
          <p className="text-dim">Output will appear here after you run your code.</p>
        )}
        {running && <p className="text-dim animate-pulse">Executing…</p>}
        {error && <p className="text-red-400">{error}</p>}
        {output && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${output.status === "Accepted" ? "bg-candidate/15 text-candidate" : "bg-red-500/15 text-red-400"}`}>
                {output.status}
              </span>
              {output.executionTimeMs != null && (
                <span className="text-dim">{output.executionTimeMs}ms</span>
              )}
            </div>
            {output.stdout && <pre className="text-white whitespace-pre-wrap">{output.stdout}</pre>}
            {output.stderr && <pre className="text-red-400 whitespace-pre-wrap">{output.stderr}</pre>}
          </div>
        )}
      </div>
    </div>
  );
}