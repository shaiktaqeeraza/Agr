import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, MessageCircle, Bookmark, Send, BarChart3, Clock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(post.isFollowing || false);
  const [saved, setSaved] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const farmer = post.userId || {};
  const isOwnPost = user && farmer._id === user.id;

  const avatar = farmer.profileImage
    ? farmer.profileImage
    : `https://ui-avatars.com/api/?background=3a9457&color=fff&name=${encodeURIComponent(farmer.name || 'F')}`;

  const toggleFollow = async () => {
    try {
      const { data } = await api.post(`/follow/${farmer._id}`);
      setFollowing(data.following);
    } catch (e) {
      // ignore, e.g. not logged in
    }
  };

  const handleMessage = () => {
    navigate(`/chats?userId=${farmer._id}`);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.cropName, url });
      } catch (e) {}
    } else {
      navigator.clipboard?.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  // simple client-side "analyzer": estimated total value & a fair-price note
  const estimatedTotal = (post.pricePerKg * post.quantity).toFixed(2);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src={avatar} alt={farmer.name} className="w-11 h-11 rounded-full object-cover border border-crop-100" />
          <div className="min-w-0">
            <p className="font-medium text-crop-900 truncate">{farmer.name || 'Unknown farmer'}</p>
            <p className="text-xs text-crop-500 flex items-center gap-1 truncate">
              <MapPin size={12} /> {farmer.location || post.location || 'Unknown location'}
              <span className="mx-1">&middot;</span>
              <Clock size={12} /> {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        {!isOwnPost && (
          <button
            onClick={toggleFollow}
            className={following ? 'btn-outline text-sm px-4 py-1.5' : 'btn-primary text-sm px-4 py-1.5'}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {post.cropImage ? (
        <img src={post.cropImage} alt={post.cropName} className="w-full max-h-96 object-cover" />
      ) : (
        <div className="w-full h-64 bg-crop-100 flex items-center justify-center text-crop-400">No image</div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-lg text-crop-900">{post.cropName}</h3>
            <p className="text-crop-700 font-medium">
              ₹{post.pricePerKg}/kg <span className="text-crop-400 font-normal">&middot; {post.quantity} kg available</span>
            </p>
          </div>
          {post.sold ? (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Sold Out</span>
          ) : (
            <span className="bg-crop-100 text-crop-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Available</span>
          )}
        </div>

        {post.negotiable && (
          <p className="text-sm text-crop-500 mt-1">Price: <span className="italic">Negotiable</span></p>
        )}

        {showAnalyzer && (
          <div className="mt-3 bg-crop-50 border border-crop-100 rounded-xl p-3 text-sm text-crop-700 space-y-1">
            <p>Estimated total value: <span className="font-semibold">₹{estimatedTotal}</span></p>
            <p>Price per kg is {post.negotiable ? 'negotiable — you can message the farmer to discuss.' : 'fixed by the farmer.'}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-crop-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnalyzer((s) => !s)}
              className="flex items-center gap-1.5 text-sm text-crop-600 hover:text-crop-800 px-3 py-1.5 rounded-full hover:bg-crop-50"
            >
              <BarChart3 size={17} /> Analyzer
            </button>
            {!isOwnPost && (
              <button
                onClick={handleMessage}
                className="flex items-center gap-1.5 text-sm text-crop-600 hover:text-crop-800 px-3 py-1.5 rounded-full hover:bg-crop-50"
              >
                <MessageCircle size={17} /> Message
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSaved((s) => !s)}
              className={`p-2 rounded-full hover:bg-crop-50 ${saved ? 'text-crop-700' : 'text-crop-400'}`}
              aria-label="Save post"
            >
              <Bookmark size={19} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-crop-50 text-crop-400" aria-label="Share post">
              <Send size={19} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
