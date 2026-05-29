// client/src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiBrainLine, RiUserLine, RiMailLine, RiLockLine, RiArrowRightLine, RiAlertLine } from 'react-icons/ri';

// ✅ Component-க்கு வெளியே — re-mount ஆகாது, focus போகாது
const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, ...rest }) => (
  <div style={{ position: 'relative' }}>
    <Icon size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }} />
    <input
      type={type}
      name={name}
      className="form-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      style={{ paddingLeft: '2.6rem' }}
      {...rest}
    />
  </div>
);

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center fade-up" style={{ marginBottom: '2rem' }}>
          <div className="flex" style={{ justifyContent: 'center', gap: '.6rem', marginBottom: '.75rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiBrainLine size={24} color="var(--blue)" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '.3rem' }}>Interview<span style={{ color: 'var(--blue)' }}>AI</span></h1>
          <p style={{ fontSize: '.9rem' }}>Create your free account</p>
        </div>

        <div className="card glow fade-up delay-1">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Get started</h2>

          {error && (
            <div className="alert alert-error scale-in">
              <RiAlertLine size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <InputField icon={RiUserLine} type="text" name="name" placeholder="John Doe" value={form.name} onChange={onChange} minLength={2} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <InputField icon={RiMailLine} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <InputField icon={RiLockLine} type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={onChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <InputField icon={RiLockLine} type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={onChange} />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: '.75rem' }} disabled={loading}>
              {loading ? <><div className="spinner" /> Creating account...</> : <>Create Account <RiArrowRightLine size={16} /></>}
            </button>
          </form>

          <p className="text-center" style={{ fontSize: '.875rem', marginTop: '1.5rem', color: 'var(--t3)' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;