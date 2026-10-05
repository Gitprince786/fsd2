import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="logo">
          PostHub
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/posts" className="nav-link">
          Posts
        </Link>

        <Link to="/scheduled" className="nav-link">
          Scheduled
        </Link>

        <Link to="/posts/create" className="create-btn">
          + Create Post
        </Link>

        <div className="profile">
          <div className="profile-avatar">P</div>
          <span>Profile</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;