function ErrorMessage({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="error-message" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠</span>

        <span className="error-text">
          {message}
        </span>
      </div>

      {onClose && (
        <button
          type="button"
          className="error-close"
          onClick={onClose}
          aria-label="Close error message"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;