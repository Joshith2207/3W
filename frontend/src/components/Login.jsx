import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = ({ onNavigate }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    // Basic Validation
    if (!email || !password) {
      setValidationError('Please enter all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result && !result.success) {
      // Error handled by AuthContext, displayed via error state
    }
  };

  const handleSignupRedirect = (e) => {
    e.preventDefault();
    clearError();
    onNavigate('signup');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <div className="auth-logo">
          <Sparkles className="logo-icon" size={28} color="#6c5ce7" />
          <span>SyncVerse</span>
        </div>
        <p className="auth-subtitle">Login to connect & post with the community</p>

        {(validationError || error) && (
          <div className="auth-error">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Mail className="input-icon" size={18} />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className="input-icon" size={18} />
            <div
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="/signup" onClick={handleSignupRedirect}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
