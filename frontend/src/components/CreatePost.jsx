import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Image, Send, X } from 'lucide-react';

const PRESET_IMAGES = [
  { id: 'sunset', label: 'Sunset', url: 'https://images.unsplash.com/photo-1472214222541-d510753a49f8?auto=format&fit=crop&w=1200&q=80' },
  { id: 'desk', label: 'Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
  { id: 'pancakes', label: 'Brunch', url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80' },
  { id: 'code', label: 'Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' }
];

const CreatePost = ({ onPostCreated }) => {
  const { token, API_URL } = useAuth();
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleSelectPreset = (url, id) => {
    setImageUrl(url);
    setSelectedPreset(id);
  };

  const handleClearImage = () => {
    setImageUrl('');
    setSelectedPreset(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-validation
    if (!text.trim() && !imageUrl.trim()) {
      setError('A post must contain either text content or an image URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: text.trim(),
          imageUrl: imageUrl.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create post');
      }

      // Success Reset
      setText('');
      setImageUrl('');
      setSelectedPreset(null);
      setShowImageInput(false);
      
      // Bubble up newly created post for instant UI prepending
      if (onPostCreated) {
        onPostCreated(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Button disabled state
  const isSubmitDisabled = !text.trim() && !imageUrl.trim();

  return (
    <div className="create-post-card glass-card">
      <form onSubmit={handleSubmit}>
        <div className="create-post-header">
          <div className="create-post-input-wrapper">
            <textarea
              className="create-post-textarea"
              placeholder="What is on your mind? Share text, images, or both..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="auth-error" style={{ marginTop: '10px', marginBottom: '0px' }}>
            {error}
          </div>
        )}

        {/* Dynamic Image Input / Unsplash Presets drawer */}
        {showImageInput && (
          <div className="image-input-container">
            <input
              type="text"
              placeholder="Paste a custom image URL (https://...)"
              className="image-url-input"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setSelectedPreset(null); // Clear selected preset if typing custom URL
              }}
            />
            
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Or choose a premium preset image:
            </div>
            
            <div className="unsplash-presets">
              {PRESET_IMAGES.map((preset) => (
                <div
                  key={preset.id}
                  className={`preset-thumbnail ${selectedPreset === preset.id ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(preset.url, preset.id)}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Image Preview Panel */}
        {imageUrl.trim() && (
          <div className="post-image-preview">
            <img src={imageUrl} alt="Post preview" onError={(e) => {
              e.target.onerror = null; 
              // Don't crash but reset preview on bad URL
            }} />
            <div className="remove-preview-btn" onClick={handleClearImage}>
              <X size={16} />
            </div>
          </div>
        )}

        <div className="create-post-actions">
          <div 
            className={`action-icon-btn ${showImageInput ? 'active' : ''}`}
            onClick={() => setShowImageInput(!showImageInput)}
          >
            <Image size={18} />
            <span>Add Photo</span>
          </div>

          <button 
            type="submit" 
            className="post-submit-btn"
            disabled={isSubmitDisabled || loading}
          >
            <Send size={16} />
            <span>{loading ? 'Posting...' : 'Share Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
