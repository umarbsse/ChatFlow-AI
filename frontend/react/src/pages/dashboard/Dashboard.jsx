import "../../assets/css/dashboard.css";

import ChatAnalysis from "./components/ChatAnalysis";
import DailyChatsChart from "./components/DailyChatsChart";
import DashboardHeader from "./components/DashboardHeader";
import DashboardLoading from "./components/DashboardLoading";
import PerformanceOverview from "./components/PerformanceOverview";
import RecentActivity from "./components/RecentActivity";
import StatsGrid from "./components/StatsGrid";
import useDashboardData from "./hooks/useDashboardData";

function Dashboard() {
  const {
    stats,
    dailyChats,
    chatCategories,
    performance,
    recentActivities,
    maxChats,
    loadingDashboard,
    errorMessage,
  } = useDashboardData();

  return (
    <section className="dashboard-page">
      <DashboardHeader />

      {loadingDashboard && <DashboardLoading />}

      {errorMessage && (
        <div className="alert alert-danger">
          <i className="fa-solid fa-circle-exclamation me-2"></i>
          {errorMessage}
        </div>
      )}

      {!loadingDashboard && !errorMessage && (
        <>
          <StatsGrid stats={stats} />

          <div className="row g-4">
            <DailyChatsChart dailyChats={dailyChats} maxChats={maxChats} />
            <ChatAnalysis chatCategories={chatCategories} />
            <PerformanceOverview performance={performance} />
            <RecentActivity recentActivities={recentActivities} />
          </div>
        </>
      )}
    </section>
  );
}

export default Dashboard;