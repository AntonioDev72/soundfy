import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfileModal({ onClose }) {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', currentPassword: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const payload = {};
      if (form.name !== user.name) payload.name = form.name;
      if (form.email !== user.email) payload.email = form.email;
      if (form.password) {
        payload.password = form.password;
        payload.currentPassword = form.currentPassword;
      }
      if (Object.keys(payload).length === 0) { setError('No changes detected.'); setLoading(false); return; }
      await api.put('/profile', payload);
      setSuccess('Profile updated! Please log in again.');
      setTimeout(() => { logout(); onClose(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#282828', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 420, border: '1px solid var(--bg-hover)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Edit Profile</h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', fontSize: 20 }}>✕</button>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <form onSubmit={handle}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Full name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ borderTop: '1px solid var(--bg-hover)', paddingTop: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Change password (optional)</p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>Current password</label>
              <input type="password" placeholder="••••••••" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>New password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#e85d5d', marginBottom: '1rem', padding: '8px 12px', background: 'rgba(232,93,93,0.1)', borderRadius: 8 }}>{error}</p>}
          {success && <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: '1rem', padding: '8px 12px', background: 'rgba(29,185,84,0.1)', borderRadius: 8 }}>{success}</p>}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#fff', borderRadius: 100, fontSize: 15, fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
