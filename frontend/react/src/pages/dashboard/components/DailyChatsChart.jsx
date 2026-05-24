function DailyChatsChart({ dailyChats, maxChats }) {
  return (
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
          {dailyChats.length === 0 && (
            <p className="text-muted mb-0">No daily chat data found.</p>
          )}

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

              <span className="dashboard-bar-label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyChatsChart;