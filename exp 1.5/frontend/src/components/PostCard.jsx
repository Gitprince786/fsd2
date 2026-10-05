import { Link } from "react-router-dom";

function PostCard({ post, onDelete }) {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "status published";

      case "scheduled":
        return "status scheduled";

      case "draft":
        return "status draft";

      default:
        return "status";
    }
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmed && onDelete) {
      onDelete(post.id);
    }
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div>
          <h3 className="post-title">
            {post.title || "Untitled Post"}
          </h3>

          <p className="post-date">
            {formatDate(post.createdAt)}
          </p>
        </div>

        <span className={getStatusClass(post.status)}>
          {post.status || "Unknown"}
        </span>
      </div>

      <div className="post-content">
        {post.content || "No content available."}
      </div>

      <div className="post-card-footer">
        <div className="post-info">
          {post.status?.toLowerCase() === "scheduled" && post.scheduledAt && (
            <span>
              Scheduled: {formatDate(post.scheduledAt)}
            </span>
          )}
        </div>

        <div className="post-actions">
          <Link
            to={`/posts/edit/${post.id}`}
            className="action-btn edit-btn"
          >
            Edit
          </Link>

          <button
            type="button"
            className="action-btn delete-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;