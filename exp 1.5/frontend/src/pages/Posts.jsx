import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import ErrorMessage from "../components/ErrorMessage";
import { getAllPosts, deletePost } from "../services/postService";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPosts();

      setPosts(response?.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load posts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
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
              <h1>Posts</h1>
              <p>View, edit and manage all your posts.</p>
            </div>

            <Link
              to="/posts/create"
              className="create-btn"
            >
              + Create Post
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
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>

              <h3>No posts found</h3>

              <p>
                You haven't created any posts yet.
              </p>

              <Link
                to="/posts/create"
                className="create-btn"
              >
                + Create Your First Post
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

export default Posts;