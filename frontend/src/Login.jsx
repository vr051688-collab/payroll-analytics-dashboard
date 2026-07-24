import { useState } from 'react';

const API_URL = 'https://payroll-analytics-dashboard.onrender.com';

function Login({ onLogin, switchToSignup, switchToForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        onLogin(data.token);
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Payroll Analytics</h1>
        <h2 className="auth-subtitle">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="dsa-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              className="dsa-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="gradient-btn auth-submit" type="submit" disabled={loading}>
            {loading ? 'Waking up server, please wait...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          <span onClick={switchToForgot}>Forgot Password?</span>
          <span onClick={switchToSignup}>New user? Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
