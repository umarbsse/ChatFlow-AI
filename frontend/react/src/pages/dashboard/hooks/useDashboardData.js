import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

const emptyDashboardData = {
  stats: [],
  dailyChats: [],
  chatCategories: [],
  performance: [],
  recentActivities: [],
};

function useDashboardData() {
  const [dashboardData, setDashboardData] = useState(emptyDashboardData);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingDashboard(true);
        setErrorMessage("");

        const response = await api.get("/dashboard");
        const data = response.data.data || {};

        setDashboardData({
          stats: data.stats || [],
          dailyChats: data.daily_chats || [],
          chatCategories: data.chat_categories || [],
          performance: data.performance || [],
          recentActivities: data.recent_activities || [],
        });
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load dashboard data."
        );

        setDashboardData(emptyDashboardData);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, []);

  const maxChats = useMemo(() => {
    if (dashboardData.dailyChats.length === 0) {
      return 0;
    }

    return Math.max(
      ...dashboardData.dailyChats.map((item) => Number(item.chats) || 0)
    );
  }, [dashboardData.dailyChats]);

  return {
    ...dashboardData,
    maxChats,
    loadingDashboard,
    errorMessage,
  };
}

export default useDashboardData;