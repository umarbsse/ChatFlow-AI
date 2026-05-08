function Header() {
  return (
    <header className="chat-header">
      <div></div>

      <div className="d-flex align-items-center gap-2">
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="chat-user-avatar me-2">J</span>
            John
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow">
            <li>
              <a className="dropdown-item" href="/account-settings">
                <i className="fa-solid fa-user-gear me-2"></i>
                Account Settings
              </a>
            </li>

            <li>
              <a className="dropdown-item" href="/change-password">
                <i className="fa-solid fa-lock me-2"></i>
                Change Password
              </a>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <a className="dropdown-item text-danger" href="/logout">
                <i className="fa-solid fa-right-from-bracket me-2"></i>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;