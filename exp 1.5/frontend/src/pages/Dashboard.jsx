import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import ErrorMessage from "../components/ErrorMessage";
import { deletePost, getAllPosts } from "../services/postService";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response?.data?.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts((previousPosts) =>
        previousPosts.filter((post) => post.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete the post."
      );
    }
  };

  const countByStatus = (status) =>
    posts.filter((post) => post.status === status).length;

  const recentPosts = [...posts]
    .sort(
      (first, second) =>
        new Date(second.createdAt) - new Date(first.createdAt)
    )
    .slice(0, 4);

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-layout">
        <Sidebar />

        <main className="page-content">
          <div className="page-header">
            <div>
              <h1>Dashboard</h1>
              <p>Manage and monitor your posts.</p>
            </div>
          </div>

          {error && (
            <ErrorMessage message={error} onClose={() => setError("")} />
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div>
                <p>Total Posts</p>
                <h2>{loading ? "-" : posts.length}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div>
                <p>Published</p>
                <h2>{loading ? "-" : countByStatus("PUBLISHED")}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">◷</div>
              <div>
                <p>Scheduled</p>
                <h2>{loading ? "-" : countByStatus("SCHEDULED")}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✎</div>
              <div>
                <p>Drafts</p>
                <h2>{loading ? "-" : countByStatus("DRAFT")}</h2>
              </div>
            </div>
          </div>

          <section className="dashboard-section">
            <div className="section-header">
              <div>
                <h2>Recent Posts</h2>
                <p>Your latest posts will appear here.</p>
              </div>
              <Link to="/posts" className="nav-link">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading posts...</p>
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No posts yet</h3>
                <p>Create your first post to get started.</p>
                <Link to="/posts/create" className="create-btn">
                  + Create Post
                </Link>
              </div>
            ) : (
              <div className="posts-grid">
                {recentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;