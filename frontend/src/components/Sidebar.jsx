import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Rss, PlusCircle, LogOut, Sparkles, Trophy } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  // Get initial of username for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="sidebar-wrapper">
      <div className="glass-card nav-menu-container" style={{ height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Brand Logo */}
        <div className="brand">
          <Sparkles className="brand-logo-icon" size={24} color="#6c5ce7" />
          <span>TaskPlanet</span>
        </div>

        {/* Navigation Items */}
        <div className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => onTabChange('feed')}
          >
            <Rss size={20} />
            <span>Social Feed</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => onTabChange('create')}
          >
            <PlusCircle size={20} />
            <span>Create Post</span>
          </div>
        </div>

        {/* Profile Card / User Capsule */}
        {user && (
          <div className="user-profile-capsule">
            <div className="avatar">
              {getInitials(user.username)}
            </div>
            <div className="user-info">
              <span className="username-display">@{user.username}</span>
              <span className="user-status">Online</span>
            </div>
            <div 
              className="logout-btn"
              onClick={logout}
              title="Log Out"
            >
              <LogOut size={18} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
