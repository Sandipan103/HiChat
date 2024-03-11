import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Chat from "./pages/Chat";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/UserContext";
import Navbar from "./component/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage /> } />
          <Route path="/chat" element={<Chat /> } />

        </Routes>
      </Router>
      <Toaster/>
    </AuthProvider>
  );
}

export default App;
