import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostForm from "../components/PostForm";
import ErrorMessage from "../components/ErrorMessage";

import {
  getPostById,
  updatePost,
} from "../services/postService";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPostById(id);

        setPost(response?.data?.data || null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load the post."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleSubmit = async (postData) => {
    try {
      setSaving(true);
      setError("");

      await updatePost(id, postData);

      navigate("/posts");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update the post."
      );
    } finally {
      setSaving(false);
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
              <h1>Edit Post</h1>
              <p>Update your existing post.</p>
            </div>
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
              <p>Loading post...</p>
            </div>
          ) : post ? (
            <div className="form-container">
              <PostForm
                initialData={post}
                onSubmit={handleSubmit}
                submitText="Update Post"
                loading={saving}
              />
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">⚠</div>
              <h3>Post not found</h3>
              <p>
                The post you are trying to edit does not exist.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EditPost;