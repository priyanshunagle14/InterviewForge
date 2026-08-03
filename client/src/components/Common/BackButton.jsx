import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            className="text-dim text-sm hover:text-white transition-colors flex items-center gap-1 mb-6"
        >
            ← Back
        </button>
    );
}