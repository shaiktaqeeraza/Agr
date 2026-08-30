import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo.js'
import { analyzeCrop } from '../utils/analyzer.js'
import {
  MapPinIcon, SparkleIcon, MessageIcon, BookmarkIcon, ShareIcon,
} from './icons.jsx'

export default function PostCard({
  post,
  isOwner,
  isFollowing,
  isSaved,
  onFollowToggle,
  onSaveToggle,
  onSoldToggle,
  onMessage,
}) {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  const available = post.status !== 'sold'
  const soldOut = post.status === 'sold' || post.availableQuantity <= 0

  async function handleAnalyze() {
    if (analyzing) return
    setAnalyzing(true)
    const result = await analyzeCrop(post.cropName || '')
    setAnalysis(result)
    setAnalyzing(false)
  }

  async function handleShare() {
    const url = `${window.location.origin}/#post-${post.id}`
    const text = `${post.cropName} — ₹${post.price}/${post.unit} from ${post.userName} on CropsConnection`
    if (navigator.share) {
      try { await navigator.share({ title: 'CropsConnection', text, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard')
    }
  }

  return (
    <div className="post-card">
      <div className="post-head">
        <button className="avatar" onClick={() => navigate(`/profile/${post.userId}`)} aria-label={post.userName}>
          {post.userPhoto ? <img src={post.userPhoto} alt="" /> : (post.userInitials || post.userName?.slice(0, 2).toUpperCase())}
        </button>
        <div className="post-user">
          <div className="name" onClick={() => navigate(`/profile/${post.userId}`)} style={{ cursor: 'pointer' }}>
            {post.userName}
          </div>
          {post.locationLabel && (
            <div className="loc"><MapPinIcon width={12} height={12} /> {post.locationLabel}</div>
          )}
        </div>
        {!isOwner && (
          <button
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={() => onFollowToggle(post.userId)}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
      <div className="post-time">{timeAgo(post.createdAt)}</div>

      {post.imageURL && <img className="post-image" src={post.imageURL} alt={post.cropName} />}

      <div className="post-info-row">
        <span className="price-tag">₹{post.price}/{post.unit}</span>
        <span className="crop-name">{post.cropName}</span>
        <span className="negotiable-tag">{post.priceType === 'negotiable' ? 'Negotiable' : 'Fixed price'}</span>
      </div>
      <div className="total-line">Total = {post.totalQuantity}{post.unit}</div>
      <div className={`status-line ${soldOut ? 'sold' : 'available'}`}>
        {soldOut ? '● Sold' : `Available: ${post.availableQuantity ?? post.totalQuantity}${post.unit}`}
      </div>

      {analysis && (
        <div className="hint-text" style={{ marginTop: 8, background: 'var(--green-100)', padding: '8px 10px', borderRadius: 10 }}>
          <strong style={{ color: 'var(--green-900)' }}>{analysis.condition}.</strong> {analysis.suggestion}
        </div>
      )}

      <div className="post-actions">
        <button className="pill-btn" onClick={handleAnalyze} disabled={analyzing}>
          <SparkleIcon width={14} height={14} /> {analyzing ? 'Analyzing…' : 'Analyzer'}
        </button>

        {isOwner ? (
          <button
            className={`pill-btn sold-toggle ${soldOut ? 'sold' : 'available'}`}
            onClick={() => onSoldToggle(post)}
          >
            {soldOut ? 'Sold' : 'Mark sold'}
          </button>
        ) : (
          <button className="pill-btn message" onClick={() => onMessage(post.userId)}>
            <MessageIcon width={14} height={14} /> Message
          </button>
        )}

        <button
          className={`icon-btn ${isSaved ? 'active' : ''}`}
          onClick={() => onSaveToggle(post.id)}
          aria-label="Save post"
          style={{ marginLeft: isOwner ? 'auto' : 0 }}
        >
          <BookmarkIcon width={17} height={17} filled={isSaved} />
        </button>
        <button className="icon-btn" onClick={handleShare} aria-label="Share post">
          <ShareIcon width={17} height={17} />
        </button>
      </div>
    </div>
  )
}
