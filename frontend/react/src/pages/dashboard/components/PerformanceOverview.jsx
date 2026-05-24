function PerformanceOverview({ performance }) {
  return (
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
          {performance.length === 0 && (
            <p className="text-muted mb-0">No performance data found.</p>
          )}

          {performance.map((item) => (
            <div className="dashboard-performance-box" key={item.title}>
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
  );
}

export default PerformanceOverview;