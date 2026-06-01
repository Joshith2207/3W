import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

const Signup = ({ onNavigate }) => {
  const { signup, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    // Field Validations
    if (!username || !email || !password) {
      setValidationError('Please enter all fields');
      return;
    }

    if (username.trim().length < 3) {
      setValidationError('Username must be at least 3 characters long');
      return;
    }

    // Password strength check
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setValidationError('Password must contain at least one capital letter');
      return;
    }
    if (!/\d/.test(password)) {
      setValidationError('Password must contain at least one number');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setValidationError('Password must contain at least one special character (e.g. @, $, !, %, *, ?, &, #, etc.)');
      return;
    }

    setLoading(true);
    const result = await signup(username, email, password);
    setLoading(false);

    if (result && !result.success) {
      // Error handled by AuthContext, displayed via error state
    }
  };

  const handleLoginRedirect = (e) => {
    e.preventDefault();
    clearError();
    onNavigate('login');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <div className="auth-logo">
          <Sparkles className="logo-icon" size={28} color="#6c5ce7" />
          <span>TaskPlanet</span>
        </div>
        <p className="auth-subtitle">Create a community account to start posting</p>

        {(validationError || error) && (
          <div className="auth-error">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username (e.g. joshith_22)"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <User className="input-icon" size={18} />
          </div>

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
              placeholder="Password (min 8 chars, A-Z, 0-9, special)"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="/login" onClick={handleLoginRedirect}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
