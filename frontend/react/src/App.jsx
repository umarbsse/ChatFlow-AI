import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/account/Register";
import Login from "./pages/account/Login";
import ForgotPassword from "./pages/account/ForgotPassword";
import Home from "./pages/home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;