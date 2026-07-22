import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Register from "./pages/account/register/Register";
import Login from "./pages/account/login/Login";
import ForgotPassword from "./pages/account/forgot-password/ForgotPassword";
import AccountSettings from "./pages/account/account-settings/AccountSettings";
import ChangePassword from "./pages/account/change-password/ChangePassword";
import Logout from "./pages/account/logout/Logout";

import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import Dashboard from "./pages/dashboard/Dashboard";
import OpenAIConfig from "./pages/config/openai-config/OpenAIConfig";
import AddVacancy from "./pages/vacancy/add/AddVacancy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />

            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/config/openai" element={<OpenAIConfig />} />
            <Route path="/Vacancy/add" element={<AddVacancy />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;