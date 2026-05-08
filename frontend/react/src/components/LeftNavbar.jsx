import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function LeftNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isChatsOpen, setIsChatsOpen] = useState(true);

  const chats = [
    { id: 1, title: "React Laravel Chat App", time: "Today" },
    { id: 20, title: "User authentication setup", time: "Yesterday" },
  ];

  const sidebarLinks = [
    {
      id: 1,
      title: "Dashboard",
      icon: "fa-solid fa-gauge",
      path: "/dashboard",
    },
    {
      id: 2,
      title: "Chats",
      icon: "fa-solid fa-comments",
      path: "/chat",
    },
    {
      id: 3,
      title: "Account Settings",
      icon: "fa-solid fa-user-gear",
      path: "/account-settings",
    },
    {
      id: 4,
      title: "Change Password",
      icon: "fa-solid fa-lock",
      path: "/change-password",
    },
  ];

  const isActivePath = (path) => {
    if (path === "/chat") {
      return (
        location.pathname === "/chat" ||
        location.pathname.startsWith("/chat/")
      );
    }

    return location.pathname === path;
  };

  const isActiveChat = (chatId) => {
    return location.pathname === `/chat/${chatId}`;
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-top">
        <div
          className="d-flex align-items-center mb-3"
          role="button"
          onClick={() => navigate("/dashboard")}
        >
          <span className="chat-user-avatar me-2">C</span>

          <div>
            <h6 className="mb-0 text-light fw-bold">ChatFlow</h6>
            <small className="text-light opacity-75">AI Assistant</small>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-light w-100 fw-semibold rounded-3"
          onClick={() => navigate("/chat")}
        >
          <i className="fa-solid fa-plus me-2"></i>
          New Chat
        </button>
      </div>

      <div className="chat-sidebar-body">
        <div className="chat-section-title">Menu</div>

        {sidebarLinks.map((link) => {
          if (link.title === "Chats") {
            return (
              <div key={`nav-${link.id}`} className="chat-dropdown">
                <button
                  type="button"
                  className={`chat-list-item ${
                    isActivePath(link.path) ? "active" : ""
                  }`}
                  onClick={() => setIsChatsOpen(!isChatsOpen)}
                >
                  <span className="chat-list-icon">
                    <i className={link.icon}></i>
                  </span>

                  <span className="chat-list-content">
                    <span className="chat-list-title">{link.title}</span>
                  </span>

                  <span className="ms-auto">
                    <i
                      className={`fa-solid ${
                        isChatsOpen ? "fa-chevron-down" : "fa-chevron-right"
                      }`}
                    ></i>
                  </span>
                </button>

                {isChatsOpen && (
                  <div className="chat-dropdown-menu">
                    {chats.map((chat) => (
                      <button
                        key={`chat-${chat.id}`}
                        type="button"
                        className={`chat-list-item chat-dropdown-item ${
                          isActiveChat(chat.id) ? "active" : ""
                        }`}
                        onClick={() => handleChatClick(chat.id)}
                      >
                        <span className="chat-list-icon">
                          <i className="fa-regular fa-message"></i>
                        </span>

                        <span className="chat-list-content">
                          <span className="chat-list-title">{chat.title}</span>
                          <span className="chat-list-time">{chat.time}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={`nav-${link.id}`}
              type="button"
              className={`chat-list-item ${
                isActivePath(link.path) ? "active" : ""
              }`}
              onClick={() => navigate(link.path)}
            >
              <span className="chat-list-icon">
                <i className={link.icon}></i>
              </span>

              <span className="chat-list-content">
                <span className="chat-list-title">{link.title}</span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default LeftNavbar;