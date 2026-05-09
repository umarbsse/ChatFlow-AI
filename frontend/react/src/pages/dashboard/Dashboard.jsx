import { useEffect, useState } from "react";
import LeftNavbar from "../../components/LeftNavbar";
import Header from "../../components/Header";
import "../../assets/css/dashboard.css";
import api from "../../services/api";

function Dashboard() {
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [stats, setStats] = useState([]);
  const [dailyChats, setDailyChats] = useState([]);
  const [chatCategories, setChatCategories] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingDashboard(true);
        setErrorMessage("");

        const response = await api.get("/dashboard");

        const dashboardData = response.data.data || {};

        setStats(dashboardData.stats || []);
        setDailyChats(dashboardData.daily_chats || []);
        setChatCategories(dashboardData.chat_categories || []);
        setPerformance(dashboardData.performance || []);
        setRecentActivities(dashboardData.recent_activities || []);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load dashboard data."
        );

        setStats([]);
        setDailyChats([]);
        setChatCategories([]);
        setPerformance([]);
        setRecentActivities([]);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, []);

  const maxChats =
    dailyChats.length > 0
      ? Math.max(...dailyChats.map((item) => Number(item.chats) || 0))
      : 0;

  return (
    <div className="chat-app">
      <LeftNavbar />

      <main className="chat-content">
        <Header />

        <section className="dashboard-page">
          <div className="dashboard-header">
            <div>
              <h4 className="fw-bold mb-1">Dashboard</h4>
              <p className="text-muted mb-0">
                Daily chat statistics, charts, and analysis.
              </p>
            </div>

          </div>

          {loadingDashboard && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3 mb-0">Loading dashboard data...</p>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger">
              <i className="fa-solid fa-circle-exclamation me-2"></i>
              {errorMessage}
            </div>
          )}

          {!loadingDashboard && (
            <>
              <div className="row g-4 mb-4">
                {stats.map((item) => (
                  <div className="col-xl-3 col-md-6" key={item.id}>
                    <div className="dashboard-stat-card">
                      <div className="dashboard-stat-icon">
                        <i className={item.icon}></i>
                      </div>

                      <div>
                        <p className="dashboard-stat-title">{item.title}</p>
                        <h3 className="dashboard-stat-value">{item.value}</h3>
                        <span
                          className={`dashboard-stat-change ${
                            String(item.change || "").startsWith("-")
                              ? "negative"
                              : "positive"
                          }`}
                        >
                          {item.change} from yesterday
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row g-4">
                <div className="col-xl-8">
                  <div className="dashboard-card">
                    <div className="dashboard-card-header">
                      <div>
                        <h5 className="fw-bold mb-1">Daily Chats</h5>
                        <p className="text-muted mb-0">
                          Number of chat conversations during the week.
                        </p>
                      </div>

                      <span className="dashboard-badge">This Week</span>
                    </div>

                    <div className="dashboard-bar-chart">
                      {dailyChats.map((item) => (
                        <div className="dashboard-bar-item" key={item.day}>
                          <div className="dashboard-bar-wrapper">
                            <div
                              className="dashboard-bar"
                              style={{
                                height:
                                  maxChats > 0
                                    ? `${(Number(item.chats) / maxChats) * 100}%`
                                    : "0%",
                              }}
                            >
                              <span>{item.chats}</span>
                            </div>
                          </div>

                          <span className="dashboard-bar-label">
                            {item.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-header">
                      <div>
                        <h5 className="fw-bold mb-1">Chat Analysis</h5>
                        <p className="text-muted mb-0">Chats by category.</p>
                      </div>
                    </div>

                    <div className="dashboard-category-list">
                      {chatCategories.map((item) => (
                        <div
                          className="dashboard-category-item"
                          key={item.title}
                        >
                          <div className="dashboard-category-left">
                            <span className="dashboard-category-icon">
                              <i className={item.icon}></i>
                            </span>
                            <span>{item.title}</span>
                          </div>

                          <div className="dashboard-category-progress">
                            <div className="progress">
                              <div
                                className="progress-bar"
                                style={{ width: `${item.value}%` }}
                              ></div>
                            </div>

                            <strong>{item.value}%</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-xl-7">
                  <div className="dashboard-card">
                    <div className="dashboard-card-header">
                      <div>
                        <h5 className="fw-bold mb-1">Performance Overview</h5>
                        <p className="text-muted mb-0">
                          AI response and chat completion performance.
                        </p>
                      </div>
                    </div>

                    <div className="dashboard-performance-grid">
                      {performance.map((item) => (
                        <div
                          className="dashboard-performance-box"
                          key={item.title}
                        >
                          <span className="dashboard-performance-icon">
                            <i className={item.icon}></i>
                          </span>
                          <h4>{item.value}</h4>
                          <p>{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-xl-5">
                  <div className="dashboard-card">
                    <div className="dashboard-card-header">
                      <div>
                        <h5 className="fw-bold mb-1">Recent Activity</h5>
                        <p className="text-muted mb-0">Latest chat actions.</p>
                      </div>
                    </div>

                    <div className="dashboard-activity-list">
                      {recentActivities.length === 0 && (
                        <p className="text-muted mb-0">No recent activity.</p>
                      )}

                      {recentActivities.map((item) => (
                        <div
                          className="dashboard-activity-item"
                          key={item.id}
                        >
                          <span className="dashboard-activity-icon">
                            <i className={item.icon}></i>
                          </span>

                          <div>
                            <h6>{item.title}</h6>
                            <p>{item.description}</p>
                            <small>{item.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;