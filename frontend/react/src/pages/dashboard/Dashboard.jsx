import LeftNavbar from "../../components/LeftNavbar";
import Header from "../../components/Header";
import "../../assets/css/dashboard.css";

function Dashboard() {
  const stats = [
    {
      id: 1,
      title: "Total Chats",
      value: "1,284",
      change: "+12.5%",
      icon: "fa-solid fa-comments",
    },
    {
      id: 2,
      title: "Chats Today",
      value: "86",
      change: "+8.2%",
      icon: "fa-solid fa-message",
    },
    {
      id: 3,
      title: "Active Users",
      value: "342",
      change: "+5.4%",
      icon: "fa-solid fa-users",
    },
    {
      id: 4,
      title: "Avg. Response Time",
      value: "1.8s",
      change: "-3.1%",
      icon: "fa-solid fa-clock",
    },
  ];

  const dailyChats = [
    { day: "Mon", chats: 45 },
    { day: "Tue", chats: 72 },
    { day: "Wed", chats: 58 },
    { day: "Thu", chats: 96 },
    { day: "Fri", chats: 86 },
    { day: "Sat", chats: 64 },
    { day: "Sun", chats: 78 },
  ];

  const chatCategories = [
    { title: "Support", value: 42, icon: "fa-solid fa-headset" },
    { title: "Sales", value: 28, icon: "fa-solid fa-chart-line" },
    { title: "Technical", value: 18, icon: "fa-solid fa-code" },
    { title: "General", value: 12, icon: "fa-solid fa-circle-question" },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New chat started",
      description: "React Laravel Chat App",
      time: "2 minutes ago",
      icon: "fa-solid fa-plus",
    },
    {
      id: 2,
      title: "User asked about authentication",
      description: "Laravel API structure",
      time: "14 minutes ago",
      icon: "fa-solid fa-user-lock",
    },
    {
      id: 3,
      title: "Chat completed",
      description: "Bootstrap UI design",
      time: "31 minutes ago",
      icon: "fa-solid fa-check",
    },
  ];

  const maxChats = Math.max(...dailyChats.map((item) => item.chats));

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

            <button className="btn btn-primary rounded-pill">
              <i className="fa-solid fa-download me-2"></i>
              Export Report
            </button>
          </div>

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
                    <span className="dashboard-stat-change positive">
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
                            height: `${(item.chats / maxChats) * 100}%`,
                          }}
                        >
                          <span>{item.chats}</span>
                        </div>
                      </div>

                      <span className="dashboard-bar-label">{item.day}</span>
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
                    <div className="dashboard-category-item" key={item.title}>
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
                  <div className="dashboard-performance-box">
                    <span className="dashboard-performance-icon">
                      <i className="fa-solid fa-bolt"></i>
                    </span>
                    <h4>94%</h4>
                    <p>Resolved Chats</p>
                  </div>

                  <div className="dashboard-performance-box">
                    <span className="dashboard-performance-icon">
                      <i className="fa-solid fa-thumbs-up"></i>
                    </span>
                    <h4>89%</h4>
                    <p>User Satisfaction</p>
                  </div>

                  <div className="dashboard-performance-box">
                    <span className="dashboard-performance-icon">
                      <i className="fa-solid fa-robot"></i>
                    </span>
                    <h4>76%</h4>
                    <p>AI Accuracy</p>
                  </div>
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
                  {recentActivities.map((item) => (
                    <div className="dashboard-activity-item" key={item.id}>
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
        </section>
      </main>
    </div>
  );
}

export default Dashboard;