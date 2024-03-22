import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/UserContext";
import Navbar from "./component/Navbar";
import Chatting from "./pages/Chatting";
import VideoCall from "./pages/Home/index";
import RoomPage from "./pages/Room";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./component/theme";
import { DarkTheme } from "./component/theme";

//Components
import Main from "./component/Main";
import AboutPage from "./component/AboutPage";
import Features from "./component/FeaturesPage";

function useNavbarVisibility() {
  const excludedPaths = ["/start", "/about", "/features", "/chatting"];

  const isNavbarVisible = () => {
    return !excludedPaths.includes(window.location.pathname);
  };

  return isNavbarVisible;
}

function App() {
  const isNavbarVisible = useNavbarVisibility();

  return (
    <ThemeProvider theme={DarkTheme}>
      <AuthProvider>
        <Router>
          {/* Conditional rendering of Navbar */}
          {isNavbarVisible() && <Navbar />}
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<Features />} />

            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chatting" element={<Chatting />} />
            <Route path="/lobby" element={<VideoCall />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
