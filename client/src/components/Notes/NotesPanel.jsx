import { useState } from "react";
import Card from "../Common/Card";

export default function NotesPanel() {
    const [notes, setNotes] = useState("");

    return (
        <Card className="p-6">
            <h3 className="font-mono text-xs text-dim tracking-wide mb-2">PRIVATE NOTES</h3>
            <p className="text-dim text-xs mb-3">Only visible to you — never shared with the candidate.</p>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down impressions, questions to follow up on, concerns…"
                rows={6}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-dim outline-none focus:border-interviewer resize-none"
            />
        </Card>
    );
}