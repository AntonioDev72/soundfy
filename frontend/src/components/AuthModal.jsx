import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ tab: initialTab = 'login', onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (tab === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#282828', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 400, border: '1px solid var(--bg-hover)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{tab === 'login' ? 'Log in to Soundfy' : 'Create account'}</h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 14, fontWeight: 500, background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
              {t === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handle}>
          {tab === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Full name</label>
              <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
          </div>
          {error && <p style={{ fontSize: 13, color: '#e85d5d', marginBottom: '1rem', padding: '8px 12px', background: 'rgba(232,93,93,0.1)', borderRadius: 8 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#fff', borderRadius: 100, fontSize: 15, fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
