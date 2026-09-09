import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import service from "../appwrite/service";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";

export default function Profile() {
  const currentUser = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      service.getUserPosts(currentUser.$id).then((res) => setPosts(res.documents));
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
    navigate("/login");
  };

  const initials = currentUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-leaf/20 text-forest font-medium flex items-center justify-center text-xl">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-medium">{currentUser?.name}</p>
          <p className="text-sm text-soil/60">{currentUser?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm border border-soil/30 rounded-full px-4 py-1.5 hover:border-clay hover:text-clay transition-colors"
        >
          Log out
        </button>
      </div>

      <h2 className="font-display text-lg text-forest mb-3">Your listings</h2>
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <img
            key={post.$id}
            src={service.getImagePreview(post.imageId)}
            alt={post.cropName}
            className="w-full h-24 object-cover rounded-lg"
          />
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-sm text-soil/50">You haven't posted any listings yet.</p>
      )}
    </div>
  );
}
