// client/src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiBrainLine, RiMailLine, RiLockLine, RiArrowRightLine, RiAlertLine } from 'react-icons/ri';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Brand */}
        <div className="text-center fade-up" style={{ marginBottom: '2rem' }}>
          <div className="flex" style={{ justifyContent: 'center', gap: '.6rem', marginBottom: '.75rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiBrainLine size={24} color="var(--blue)" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '.3rem' }}>Interview<span style={{ color: 'var(--blue)' }}>AI</span></h1>
          <p style={{ fontSize: '.9rem' }}>Sign in to continue practicing</p>
        </div>

        {/* Card */}
        <div className="card glow fade-up delay-1">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Welcome back</h2>

          {error && (
            <div className="alert alert-error scale-in">
              <RiAlertLine size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <RiMailLine size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  lang="en"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  style={{ paddingLeft: '2.6rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <RiLockLine size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }} />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                  lang="en"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  style={{ paddingLeft: '2.6rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: '.75rem' }} disabled={loading}>
              {loading ? <><div className="spinner" /> Signing in...</> : <>Sign In <RiArrowRightLine size={16} /></>}
            </button>
          </form>

          <p className="text-center" style={{ fontSize: '.875rem', marginTop: '1.5rem', color: 'var(--t3)' }}>
            No account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;