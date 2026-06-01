import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import Widgets from './components/Widgets';
import './styles/index.css';
import './styles/App.css';

// Main App component wrapped with Auth context inside AuthProvider
const AppContent = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'create'

  // 1. Loading State Renders pulsing spinner
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '0.05em' }}>
          CONNECTING TO SyncVerse...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated state: serve Signup or Login
  if (!user) {
    return authView === 'login' ? (
      <Login onNavigate={setAuthView} />
    ) : (
      <Signup onNavigate={setAuthView} />
    );
  }

  // 3. Authenticated state: serve full responsive MERN dashboard
  return (
    <div className="app-container">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Column (Feed or Composer) */}
      <main className="main-content">
        {activeTab === 'feed' ? (
          <Feed />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="feed-header">
              <h2>Compose Post</h2>
              <p>Express yourself to the community. Add text, high-res images, or both.</p>
            </div>
            <CreatePost onPostCreated={() => setActiveTab('feed')} />
          </div>
        )}
      </main>

      {/* Desktop Right Column Widgets (Hidden on Tablet/Mobile) */}
      <Widgets />

      {/* Mobile Sticky Bottom Navigation (Hidden on Desktop) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
