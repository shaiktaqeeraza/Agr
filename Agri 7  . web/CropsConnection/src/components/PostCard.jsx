import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiMapPin, FiBookmark, FiSend, FiHeart, FiMessageCircle } from "react-icons/fi";
import service from "../appwrite/service";
import CommentSection from "./CommentSection";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostCard({ post, onFollowToggle, isFollowing, onMessage }) {
  const currentUser = useSelector((state) => state.auth.userData);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const imageUrl = post.imageUrl || service.getImagePreview(post.imageId);
  const isOwner = currentUser?.$id === post.userId;

  useEffect(() => {
    if (post.isDemo) {
      setLikeCount(post.likeCount || 0);
      return;
    }

    service.getLikesForPost(post.$id).then((res) => {
      setLikeCount(res.total);
      setLiked(res.documents.some((d) => d.userId === currentUser?.$id));
    });
  }, [post.$id, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return;
    const nowLiked = await service.toggleLike(post.$id, currentUser.$id);
    setLiked(nowLiked);
    setLikeCount((c) => (nowLiked ? c + 1 : c - 1));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    const nowSaved = await service.toggleSave(currentUser.$id, post.$id);
    setSaved(nowSaved);
  };

  const initials = post.userName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <article className="border border-line rounded-2xl bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-leaf/20 text-forest font-medium flex items-center justify-center">
            {initials}
          </div>
          <div>
            <p className="font-medium text-sm leading-tight">{post.userName}</p>
            <p className="text-xs text-soil/60 flex items-center gap-1">
              <FiMapPin size={12} /> {post.location}
            </p>
          </div>
        </div>
        <div className="text-right">
          {currentUser && !isOwner && (
            <button
              onClick={() => onFollowToggle(post.userId)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                isFollowing
                  ? "border-forest bg-forest text-white"
                  : "border-soil/30 text-soil hover:border-forest hover:text-forest"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
          <p className="text-xs text-soil/50 mt-1">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      <div className="mt-3">
        <img src={imageUrl} alt={post.cropName} className="w-full h-64 object-cover" />
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-4 text-sm font-medium text-soil">
          <span>₹{post.price}/kg</span>
          <span>{post.cropName}</span>
          <span className="text-soil/60">{post.caption}</span>
        </div>
        <p className="text-sm text-soil/70 mt-1">Total = {post.quantity}kg</p>

        <div className="flex items-center justify-between mt-3">
          {post.status === "sold" ? (
            <span className="text-clay font-medium text-sm">Sold</span>
          ) : (
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${liked ? "text-clay" : "text-soil/60"}`}
            >
              <FiHeart className={liked ? "fill-current" : ""} /> {likeCount}
            </button>
          )}

          {currentUser && !isOwner && (
            <button
              onClick={() => onMessage(post.userId, post.userName)}
              className="border border-soil/30 rounded-full px-4 py-1 text-sm hover:border-forest hover:text-forest transition-colors"
            >
              Message
            </button>
          )}

          <div className="flex items-center gap-3 text-soil/60">
            {!post.isDemo && (
              <button onClick={() => setShowComments((s) => !s)} aria-label="Comments">
                <FiMessageCircle size={18} />
              </button>
            )}
            {currentUser && (
              <>
                <button onClick={handleSave} aria-label="Save">
                  <FiBookmark size={18} className={saved ? "fill-current text-forest" : ""} />
                </button>
                <button aria-label="Share">
                  <FiSend size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {isOwner && post.status !== "sold" && (
          <button
            onClick={() => service.markAsSold(post.$id)}
            className="mt-3 text-xs text-clay underline"
          >
            Mark as sold
          </button>
        )}
      </div>

      {showComments && !post.isDemo && <CommentSection postId={post.$id} />}
    </article>
  );
}
