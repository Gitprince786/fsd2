import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostForm from "../components/PostForm";
import ErrorMessage from "../components/ErrorMessage";
import { createPost } from "../services/postService";

function CreatePost() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (postData) => {
    try {
      setLoading(true);
      setError("");

      await createPost(postData);

      navigate("/posts");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create post. Please try again."
      );
    } finally {
      setLoading(false);
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
              <h1>Create Post</h1>
              <p>Create a new post for your audience.</p>
            </div>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onClose={() => setError("")}
            />
          )}

          <div className="form-container">
            <PostForm
              onSubmit={handleSubmit}
              submitText="Create Post"
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreatePost;