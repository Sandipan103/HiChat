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
import NewContact from "./component/NewContact";
import NewGroup from "./component/NewGroup";
import Chatting from "./pages/Chatting";
import VideoCall from "./pages/Home";
import RoomPage from "./pages/Room";
import GlobalStyle from "./globalStyles";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./component/theme";
import { DarkTheme } from "./component/theme";

// import { AnimatePresence } from "framer-motion";

//Components
import Main from "./component/Main";
import AboutPage from "./component/AboutPage";
import Features from "./component/FeaturesPage";
// import SoundBar from "./subComponents/SoundBar";

function App() {
  return (
    // <GlobalStyle>
    <ThemeProvider theme={DarkTheme}>
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start" element={<Main />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<Features />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage /> } />
          <Route path="/chat" element={<Chat /> } />
          <Route path="/chatting" element={<Chatting /> } />
          <Route path="/addContact" element={<NewContact /> } />
          <Route path="/createGroup" element={<NewGroup /> } />
          <Route path="/lobby" element={<VideoCall /> } />
          {/* <Route path="/room/:roomId" element={<RoomPage /> } /> */}
        </Routes>
      </Router>
      <Toaster/>
    </AuthProvider>
    </ThemeProvider>
    //  </GlobalStyle>
  );
}

export default App;
