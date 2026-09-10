import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus } from "react-icons/fi";
import service from "../appwrite/service";
import PostCard from "../components/PostCard";
import demoPosts from "../utils/demoPosts";

export default function Feed() {
  const currentUser = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [followingIds, setFollowingIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    service
      .getPosts()
      .then((res) => setPosts(res.documents.length > 0 ? res.documents : demoPosts))
      .catch(() => setPosts(demoPosts));
    if (currentUser) {
      service.getFollowing(currentUser.$id).then((res) =>
        setFollowingIds(res.documents.map((d) => d.followingId))
      );
    }
  }, [currentUser]);

  const handleFollowToggle = async (targetUserId) => {
    const nowFollowing = await service.toggleFollow(currentUser.$id, targetUserId);
    setFollowingIds((ids) =>
      nowFollowing ? [...ids, targetUserId] : ids.filter((id) => id !== targetUserId)
    );
  };

  const handleMessage = (userId, userName) => {
    navigate(`/chats?with=${userId}&name=${encodeURIComponent(userName)}`);
  };

  const filtered = posts.filter(
    (p) =>
      p.cropName.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-4">
      <div className="relative mb-4">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-soil/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the crops name and location"
          className="w-full border border-line rounded-full pl-10 pr-4 py-2 text-sm bg-white outline-none focus:border-forest"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((post) => (
          <PostCard
            key={post.$id}
            post={post}
            isFollowing={followingIds.includes(post.userId)}
            onFollowToggle={handleFollowToggle}
            onMessage={handleMessage}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-soil/50 text-sm py-10">No posts yet. Be the first to share a crop.</p>
        )}
      </div>

      <button
        onClick={() => navigate("/create")}
        aria-label="New post"
        className="fixed bottom-6 right-1/2 translate-x-[calc(50%+8px)] sm:right-8 sm:translate-x-0 bg-forest text-white rounded-full p-4 shadow-lg"
      >
        <FiPlus size={22} />
      </button>
    </div>
  );
}
