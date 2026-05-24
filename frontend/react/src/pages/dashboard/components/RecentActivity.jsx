function RecentActivity({ recentActivities }) {
  return (
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
  );
}

export default RecentActivity;