import React from 'react';
import { Trophy, Activity, MessageSquare, Sparkles } from 'lucide-react';

const Widgets = () => {
  return (
    <div className="widgets-wrapper">
      
      {/* Community Statistics Card */}
      <div className="glass-card widget-card">
        <h3 className="widget-title" style={{ display: 'flex', alignHover: 'center', gap: '10px' }}>
          <Activity size={18} color="#6c5ce7" />
          <span>Community Stats</span>
        </h3>
        <div className="stats-grid">
          <div className="stats-row">
            <span className="stats-label">
              <MessageSquare size={14} />
              <span>Platform Activity</span>
            </span>
            <span className="stats-value" style={{ color: 'var(--accent-green)' }}>High</span>
          </div>
          
          <div className="stats-row">
            <span className="stats-label">
              <span>Seeded Nodes</span>
            </span>
            <span className="stats-value">Online</span>
          </div>

          <div className="stats-row">
            <span className="stats-label">
              <span>Security Engine</span>
            </span>
            <span className="stats-value">AES-JWT</span>
          </div>
        </div>
      </div>

      {/* Gamified Leaderboard Card */}
      <div className="glass-card widget-card">
        <h3 className="widget-title" style={{ display: 'flex', alignHover: 'center', gap: '10px' }}>
          <Trophy size={18} color="#ff7675" />
          <span>Top Contributors</span>
        </h3>
        <div className="active-users-list">
          <div className="active-user-item">
            <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.8rem', background: 'gold' }}>J</div>
            <span className="active-username">jane_smith</span>
            <span className="active-user-tag">Gold Poster</span>
          </div>

          <div className="active-user-item">
            <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.8rem', background: 'silver' }}>J</div>
            <span className="active-username">john_doe</span>
            <span className="active-user-tag">Pro Dev</span>
          </div>

          <div className="active-user-item">
            <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.8rem', background: '#cd7f32' }}>A</div>
            <span className="active-username">alex_walker</span>
            <span className="active-user-tag">Contributor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
