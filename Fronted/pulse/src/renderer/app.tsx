import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./components/LandingPage/LandingPage";
import ChatShell from "./components/ChatShell/ChatShell"; 
import { AuthProvider } from './context/AuthContext'; 

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatShell />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
