import { useState } from 'react';

const API_URL = 'https://payroll-analytics-dashboard.onrender.com';

function Signup({ onSignupSuccess, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Signup failed');
      } else {
        onSignupSuccess();
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
        <h2 className="auth-subtitle">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="dsa-input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="dsa-input"
            type="email"
            placeholder="Gmail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="dsa-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            className="dsa-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button className="gradient-btn auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-links">
          <span onClick={switchToLogin}>Already have an account? Login</span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
