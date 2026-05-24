import { Outlet } from "react-router-dom";
import LeftNavbar from "../components/LeftNavbar";
import Header from "../components/Header";

function AppLayout() {
  return (
    <div className="chat-app">
      <LeftNavbar />

      <main className="chat-content">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;