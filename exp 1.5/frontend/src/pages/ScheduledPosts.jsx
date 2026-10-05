import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import ErrorMessage from "../components/ErrorMessage";

import {
  getScheduledPosts,
  deletePost,
} from "../services/postService";

function ScheduledPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadScheduledPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getScheduledPosts();

      setPosts(response?.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load scheduled posts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      setError("");

      await deletePost(id);

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the post."
      );
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-layout">
        <Sidebar />

        <main className="page-content">
          <div className="page-header">
            <div>
              <h1>Scheduled Posts</h1>
              <p>
                Manage posts that are scheduled for publishing.
              </p>
            </div>

            <Link
              to="/posts/create"
              className="create-btn"
            >
              + Schedule Post
            </Link>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onClose={() => setError("")}
            />
          )}

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading scheduled posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◷</div>

              <h3>No scheduled posts</h3>

              <p>
                You don't have any posts scheduled yet.
              </p>

              <Link
                to="/posts/create"
                className="create-btn"
              >
                + Schedule a Post
              </Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ScheduledPosts;