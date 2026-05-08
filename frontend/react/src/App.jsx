import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/account/Register";
import Login from "./pages/account/Login";
import ForgotPassword from "./pages/account/ForgotPassword";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;