import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function LeftNavbar({ refreshKey }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isChatRoute =
    location.pathname === "/chat" || location.pathname.startsWith("/chat/");

  const [isChatsOpen, setIsChatsOpen] = useState(isChatRoute);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);

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
      title: "OpenAI Config",
      icon: "fa-solid fa-gear",
      path: "/config/openai",
    },
    {
      id: 4,
      title: "Add Vacancy",
      icon: "fa-solid fa-briefcase",
      path: "/Vacancy/add",
    },
    {
      id: 5,
      title: "Account Settings",
      icon: "fa-solid fa-user-gear",
      path: "/account-settings",
    },
    {
      id: 6,
      title: "Change Password",
      icon: "fa-solid fa-lock",
      path: "/change-password",
    },
  ];

  useEffect(() => {
    setIsChatsOpen(isChatRoute);
  }, [isChatRoute]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoadingChats(true);

        const response = await api.get("/chat/list");

        const chatList =
          response.data.data?.chats ||
          response.data.chats ||
          response.data.data ||
          [];

        setChats(chatList);
      } catch (error) {
        console.log("Failed to fetch chats:", error);
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, [refreshKey]);

  const isActivePath = (path) => {
    if (path === "/chat") {
      return isChatRoute;
    }

    return location.pathname === path;
  };

  const isActiveChat = (chatId) => {
    return location.pathname === `/chat/${chatId}`;
  };

  const handleChatMenuClick = () => {
    if (!isChatRoute) {
      navigate("/chat");
      return;
    }

    setIsChatsOpen((previousValue) => !previousValue);
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();

    if (!chatId || deletingChatId) return;

    const confirmed = window.confirm(
      "Delete this chat? This will delete all messages in this chat."
    );

    if (!confirmed) return;

    try {
      setDeletingChatId(chatId);

      await api.delete(`/chat/instances/${chatId}`);

      setChats((previousChats) =>
        previousChats.filter((chat) => Number(chat.id) !== Number(chatId))
      );

      if (isActiveChat(chatId)) {
        navigate("/chat", { replace: true });
      }
    } catch (error) {
      console.log("Failed to delete chat:", error);
      alert(error.response?.data?.message || "Failed to delete chat.");
    } finally {
      setDeletingChatId(null);
    }
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
                  onClick={handleChatMenuClick}
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

                {isChatRoute && isChatsOpen && (
                  <div className="chat-dropdown-menu">
                    {loadingChats && (
                      <div className="chat-list-item chat-dropdown-item">
                        <span className="chat-list-icon">
                          <span className="spinner-border spinner-border-sm"></span>
                        </span>

                        <span className="chat-list-content">
                          <span className="chat-list-title">
                            Loading chats...
                          </span>
                        </span>
                      </div>
                    )}

                    {!loadingChats && chats.length === 0 && (
                      <div className="chat-list-item chat-dropdown-item">
                        <span className="chat-list-icon">
                          <i className="fa-regular fa-message"></i>
                        </span>

                        <span className="chat-list-content">
                          <span className="chat-list-title">No chats found</span>
                        </span>
                      </div>
                    )}

                    {!loadingChats &&
                      chats.map((chat) => (
                        <div
                          key={`chat-${chat.id}`}
                          className={`chat-list-item chat-dropdown-item chat-instance-row ${
                            isActiveChat(chat.id) ? "active" : ""
                          }`}
                          role="button"
                          onClick={() => handleChatClick(chat.id)}
                        >
                          <span className="chat-list-icon">
                            <i className="fa-regular fa-message"></i>
                          </span>

                          <span className="chat-list-content">
                            <span className="chat-list-title">
                              {chat.title ||
                                chat.instance_title ||
                                "Untitled Chat"}
                            </span>

                            <span className="chat-list-time">
                              {chat.time || chat.added_at || ""}
                            </span>
                          </span>

                          <button
                            type="button"
                            className="chat-instance-delete-btn"
                            onClick={(e) => handleDeleteChat(e, chat.id)}
                            disabled={deletingChatId === chat.id}
                            title="Delete chat"
                          >
                            {deletingChatId === chat.id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className="fa-solid fa-trash"></i>
                            )}
                          </button>
                        </div>
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