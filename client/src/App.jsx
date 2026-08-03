import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import LandingPage from "./pages/LandingPage";
import InterviewerHome from "./pages/InterviewerHome";
import JoinInterview from "./pages/JoinInterview";
import InterviewRoom from "./pages/InterviewRoom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CandidateDashboard from "./pages/CandidateDashboard";


export default function App() {
  return (
    <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/interviewer" element={<InterviewerHome />} />
          <Route path="/join" element={<JoinInterview />} />
          <Route path="/room/:roomId" element={<InterviewRoom />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        </Routes>
    </ToastProvider>
  );
}