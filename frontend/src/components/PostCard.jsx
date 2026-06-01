import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageSquare, Send } from 'lucide-react';

const PostCard = ({ post, onUpdatePost }) => {
  const { user, token, API_URL } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Get initial of username for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Human-readable date formatter (e.g. "2 hours ago", "Just now")
  const formatTimeAgo = (dateString) => {
    try {
      const now = new Date();
      const past = new Date(dateString);
      const msDiff = now.getTime() - past.getTime();
      
      const secDiff = Math.floor(msDiff / 1000);
      if (secDiff < 60) return 'Just now';
      
      const minDiff = Math.floor(secDiff / 60);
      if (minDiff < 60) return `${minDiff}m ago`;
      
      const hourDiff = Math.floor(minDiff / 60);
      if (hourDiff < 24) return `${hourDiff}h ago`;
      
      const dayDiff = Math.floor(hourDiff / 24);
      if (dayDiff === 1) return 'Yesterday';
      return `${dayDiff} days ago`;
    } catch (e) {
      return 'Some time ago';
    }
  };

  // Check if current logged-in user liked the post
  const isLiked = user && post.likes && post.likes.includes(user.username);

  // Toggle Like API Call
  const handleLike = async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedLikesList = await response.json();

      if (response.ok) {
        // Trigger instant update in parent feed state
        onUpdatePost({
          ...post,
          likes: updatedLikesList
        });
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // Submit Comment API Call
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token || !commentText.trim() || commentLoading) return;

    setCommentLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText.trim() })
      });

      const updatedCommentsList = await response.json();

      if (response.ok) {
        setCommentText('');
        // Trigger instant update in parent feed state
        onUpdatePost({
          ...post,
          comments: updatedCommentsList
        });
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="post-card glass-card">
      {/* Post Header (Avatar, Username, Timestamp) */}
      <div className="post-header">
        <div className="avatar">
          {getInitials(post.username)}
        </div>
        <div className="post-meta">
          <span className="post-username">@{post.username}</span>
          <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
        </div>
      </div>

      {/* Post Content (Text) */}
      {post.text && <p className="post-text">{post.text}</p>}

      {/* Post Content (Image) */}
      {post.imageUrl && (
        <div className="post-image-box">
          <img src={post.imageUrl} alt="Post content" loading="lazy" />
        </div>
      )}

      {/* Social Engagement Stats Row */}
      <div className="post-stats-row">
        <div className="stats-item" title={post.likes.length > 0 ? `Liked by: ${post.likes.join(', ')}` : 'No likes yet'}>
          <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        </div>
        <div className="stats-item">
          <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>

      {/* Engagement Actions Toolbar */}
      <div className="post-actions-toolbar">
        <button 
          className={`toolbar-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <Heart size={18} />
          <span>Like</span>
        </button>

        <button 
          className={`toolbar-btn ${showComments ? 'active-comments' : ''}`}
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare size={18} />
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Slide-Down Drawer */}
      {showComments && (
        <div className="comments-drawer">
          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                    {getInitials(comment.username)}
                  </div>
                  <div className="comment-bubble">
                    <div className="comment-header">
                      <span className="comment-user">@{comment.username}</span>
                      <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
                Be the first to comment on this post!
              </p>
            )}
          </div>

          {/* Inline Comment Input Box */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-input-box">
              <input
                type="text"
                placeholder="Write a comment..."
                className="comment-input-field"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="comment-submit-btn"
                disabled={!commentText.trim() || commentLoading}
              >
                <Send size={14} />
              </button>
            </form>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Please sign in to write comments.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
