function StatsGrid({ stats }) {
  if (stats.length === 0) {
    return <p className="text-muted">No dashboard stats found.</p>;
  }

  return (
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
  );
}

export default StatsGrid;