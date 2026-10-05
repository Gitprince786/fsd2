import { useEffect, useState } from "react";

const EMPTY_INITIAL_DATA = {};

function PostForm({
  initialData = EMPTY_INITIAL_DATA,
  onSubmit,
  submitText = "Create Post",
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "DRAFT",
    scheduledAt: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      content: initialData.content || "",
      status: initialData.status || "DRAFT",
      scheduledAt: initialData.scheduledAt
        ? formatDateTimeForInput(initialData.scheduledAt)
        : "",
    });
  }, [initialData]);

  const formatDateTimeForInput = (date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const offset = parsedDate.getTimezoneOffset();
    const localDate = new Date(parsedDate.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content must not be empty.";
    }

    if (formData.content.length > 280) {
      newErrors.content = "Content exceeds the 280 character limit.";
    }

    if (formData.status === "SCHEDULED" && !formData.scheduledAt) {
      newErrors.scheduledAt =
        "Please select a date and time for the scheduled post.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const postData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      status: formData.status,
      scheduledAt:
        formData.status === "SCHEDULED"
          ? formData.scheduledAt
          : null,
    };

    if (onSubmit) {
      onSubmit(postData);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {/* Title */}
      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title"
          disabled={loading}
        />

        {errors.title && (
          <p className="form-error">{errors.title}</p>
        )}
      </div>

      {/* Content */}
      <div className="form-group">
        <div className="label-row">
          <label htmlFor="content">
            Content <span className="required">*</span>
          </label>

          <span
            className={
              formData.content.length > 280
                ? "character-count exceeded"
                : "character-count"
            }
          >
            {formData.content.length}/280
          </span>
        </div>

        <textarea
          id="content"
          name="content"
          rows="7"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content..."
          disabled={loading}
        />

        {errors.content && (
          <p className="form-error">{errors.content}</p>
        )}
      </div>

      {/* Status */}
      <div className="form-group">
        <label htmlFor="status">Status</label>

        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
      </div>

      {/* Schedule */}
      {formData.status === "SCHEDULED" && (
        <div className="form-group">
          <label htmlFor="scheduledAt">
            Schedule Date & Time
          </label>

          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={handleChange}
            disabled={loading}
          />

          {errors.scheduledAt && (
            <p className="form-error">{errors.scheduledAt}</p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}

export default PostForm;