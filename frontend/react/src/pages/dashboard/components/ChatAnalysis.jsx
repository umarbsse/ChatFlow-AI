function ChatAnalysis({ chatCategories }) {
  return (
    <div className="col-xl-4">
      <div className="dashboard-card h-100">
        <div className="dashboard-card-header">
          <div>
            <h5 className="fw-bold mb-1">Chat Analysis</h5>
            <p className="text-muted mb-0">Chats by category.</p>
          </div>
        </div>

        <div className="dashboard-category-list">
          {chatCategories.length === 0 && (
            <p className="text-muted mb-0">No chat analysis found.</p>
          )}

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
  );
}

export default ChatAnalysis;