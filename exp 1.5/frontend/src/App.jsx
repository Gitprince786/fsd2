import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ScheduledPosts from "./pages/ScheduledPosts";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Posts */}
        <Route path="/posts" element={<Posts />} />

        {/* Create Post */}
        <Route path="/posts/create" element={<CreatePost />} />

        {/* Edit Post */}
        <Route path="/posts/edit/:id" element={<EditPost />} />

        {/* Scheduled Posts */}
        <Route path="/scheduled" element={<ScheduledPosts />} />

        {/* 404 - Redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;