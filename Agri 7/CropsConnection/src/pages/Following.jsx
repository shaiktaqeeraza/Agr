import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import service from "../appwrite/service";
import PostCard from "../components/PostCard";

export default function Following() {
  const currentUser = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    service.getFollowing(currentUser.$id).then(async (res) => {
      const ids = res.documents.map((d) => d.followingId);
      setFollowingIds(ids);
      const allPosts = await service.getPosts();
      setPosts(allPosts.documents.filter((p) => ids.includes(p.userId)));
    });
  }, [currentUser]);

  const handleFollowToggle = async (targetUserId) => {
    await service.toggleFollow(currentUser.$id, targetUserId);
    setFollowingIds((ids) => ids.filter((id) => id !== targetUserId));
    setPosts((posts) => posts.filter((p) => p.userId !== targetUserId));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      <h1 className="font-display text-xl text-forest mb-2">Following</h1>
      {posts.map((post) => (
        <PostCard
          key={post.$id}
          post={post}
          isFollowing={followingIds.includes(post.userId)}
          onFollowToggle={handleFollowToggle}
          onMessage={() => {}}
        />
      ))}
      {posts.length === 0 && (
        <p className="text-sm text-soil/50 text-center py-10">
          You're not following any farmers yet. Follow someone from the Feed.
        </p>
      )}
    </div>
  );
}
