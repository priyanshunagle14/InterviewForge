export default function Badge({ children, tone = "candidate" }) {
    const tones = {
        interviewer: "bg-interviewer/15 text-interviewer border-interviewer/30",
        candidate: "bg-candidate/15 text-candidate border-candidate/30",
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tones[tone]}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${tone === "interviewer" ? "bg-interviewer" : "bg-candidate"}`} />
            {children}
        </span>
    );
}