import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { Rss, Sparkles } from 'lucide-react';

const Feed = () => {
  const { user, API_URL } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts from API (supports pagination)
  const fetchPosts = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);
      
      // Request page number with a limit of 3 for smooth testing of pagination flow
      const response = await fetch(`${API_URL}/posts?page=${pageNumber}&limit=3`);
      
      if (!response.ok) {
        throw new Error('Failed to load posts from API');
      }
      
      const data = await response.json();
      
      // If fetching page 1, replace posts. Otherwise, append to existing list
      if (pageNumber === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      }
      
      setHasMore(data.hasMore);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve feed. Please check your connection.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [API_URL]);

  // Load next batch of posts
  const loadNextPage = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  // Prepend newly created post for instant loading in UI
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Update specific post in local state for instant Like/Comment reactions
  const handleUpdatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  if (loading) {
    return (
      <div className="loading-screen" style={{ height: '300px', background: 'none' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading Social Feed...</p>
      </div>
    );
  }

  return (
    <div className="feed-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header Banner */}
      <div className="feed-header">
        <h2>Community Feed</h2>
        <p>Explore ideas, images, and milestones from everyone in TaskPlanet</p>
      </div>

      {/* Write Post Box (Only visible if signed in) */}
      {user && <CreatePost onPostCreated={handlePostCreated} />}

      {error && (
        <div className="auth-error" style={{ margin: '0' }}>
          {error}
        </div>
      )}

      {/* Feed List of Cards */}
      <div className="posts-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdatePost={handleUpdatePost}
              />
            ))}
            
            {/* Load More Button Rendered if more entries are in database */}
            {hasMore && (
              <button 
                className="load-more-btn"
                onClick={loadNextPage}
                disabled={loadingMore}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-main)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  textAlign: 'center',
                  width: '100%',
                  marginTop: '8px'
                }}
              >
                {loadingMore ? 'Loading next batch...' : 'Load More Posts'}
              </button>
            )}
          </>
        ) : (
          <div className="empty-feed glass-card">
            <Rss size={48} color="var(--text-muted)" style={{ opacity: 0.5 }} />
            <h3>No posts found</h3>
            <p>Seeding is processing or there are no community entries yet. Be the first to start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
