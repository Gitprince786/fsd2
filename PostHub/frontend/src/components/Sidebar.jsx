import { NavLink } from "react-router-dom";

function Sidebar() {
  const getLinkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <p className="sidebar-title">MENU</p>

        <NavLink to="/dashboard" className={getLinkClass}>
          <span className="sidebar-icon">▦</span>
          Dashboard
        </NavLink>

        <NavLink to="/posts" className={getLinkClass}>
          <span className="sidebar-icon">📝</span>
          Posts
        </NavLink>

        <NavLink to="/posts/create" className={getLinkClass}>
          <span className="sidebar-icon">＋</span>
          Create Post
        </NavLink>

        <NavLink to="/scheduled" className={getLinkClass}>
          <span className="sidebar-icon">◷</span>
          Scheduled
        </NavLink>
      </div>

      <div className="sidebar-bottom">
        <p className="sidebar-title">OTHER</p>

        <button className="sidebar-link sidebar-button">
          <span className="sidebar-icon">⚙</span>
          Settings
        </button>

        <button className="sidebar-link sidebar-button">
          <span className="sidebar-icon">?</span>
          Help
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;