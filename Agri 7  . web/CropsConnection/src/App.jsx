import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Following from "./pages/Following";
import Chats from "./pages/Chats";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) dispatch(login({ userData }));
      else dispatch(logout());
      setLoading(false);
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-forest font-display">
        Loading CropsConnection...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<><Header /><Feed /></>} />
        <Route path="/create" element={<ProtectedRoute><><Header /><CreatePost /></></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><><Header /><Profile /></></ProtectedRoute>} />
        <Route path="/following" element={<ProtectedRoute><><Header /><Following /></></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><><Header /><Chats /></></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
