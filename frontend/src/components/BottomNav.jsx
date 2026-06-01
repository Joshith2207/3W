import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Rss, PlusCircle, LogOut } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const { logout } = useAuth();

  return (
    <nav className="bottom-nav">
      <div 
        className={`bottom-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
        onClick={() => onTabChange('feed')}
      >
        <Rss size={20} />
        <span>Feed</span>
      </div>

      <div 
        className={`bottom-nav-item ${activeTab === 'create' ? 'active' : ''}`}
        onClick={() => onTabChange('create')}
      >
        <PlusCircle size={20} />
        <span>Create</span>
      </div>

      <div 
        className="bottom-nav-item"
        onClick={logout}
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </div>
    </nav>
  );
};

export default BottomNav;
