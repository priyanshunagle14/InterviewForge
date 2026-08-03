import Card from "../Common/Card";
import Badge from "../Common/Badge";

export default function ParticipantsList({ participants, mySocketId, role, onRemove }) {
  console.log(participants);
  return (
    <Card className="p-6">
      <h3 className="font-mono text-xs text-dim tracking-wide mb-4">PARTICIPANTS</h3>
      <div className="flex flex-col gap-3">
        {participants.length === 0 && (
          <div className="flex items-center gap-2 text-dim text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            Waiting for participants to join…
          </div>
        )}
        {participants.map((p) => (
          <div key={p.socketId} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm">
                {p.name}
                {p.socketId === mySocketId && <span className="text-dim"> (you)</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={p.role === "interviewer" ? "interviewer" : "candidate"}>
                {p.role}
              </Badge>
              {role === "interviewer" && p.role === "candidate" && (
                <button
                  onClick={() => onRemove(p.socketId)}
                  className="text-xs text-red-400 hover:text-red-300"
                  aria-label={`Remove ${p.name} from the interview`}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}