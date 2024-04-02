import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/UserContext";
import Chatting from "./pages/Chatting";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./component/theme";
import { DarkTheme } from "./component/theme";


function App() {
  return (
    <ThemeProvider theme={DarkTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chatting" element={<Chatting />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
