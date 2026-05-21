import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33z"/></svg>;
const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.076-5.816c0-5.14-4.226-9.28-9.406-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"/></svg>;
const HeartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.593c-.525-.438-1.043-.862-1.51-1.25l-.05-.041C7.117 17.656 4.35 15.44 2.826 13.1 1.165 10.56.743 8.34 1.38 6.687c.529-1.378 1.672-2.356 3.058-2.63.982-.193 2.099-.043 3.043.5.748.432 1.424 1.096 1.99 1.944C9.944 5.48 10.607 4.8 11.36 4.356c.95-.547 2.067-.696 3.047-.5 1.386.274 2.529 1.252 3.059 2.63.636 1.655.214 3.873-1.447 6.413-1.523 2.34-4.29 4.556-7.614 7.202l-.05.041c-.468.388-.987.812-1.512 1.25l-.05.041z"/></svg>;
const PlaylistIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zM4 11a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2H4z"/></svg>;

const navStyle = ({ isActive }) => ({
  display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px',
  borderRadius: 6, color: isActive ? '#fff' : 'var(--text-secondary)',
  fontWeight: isActive ? 700 : 400, fontSize: 14, transition: 'all 0.15s',
  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
});

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside style={{ width: 'var(--sidebar-width)', background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', padding: '1rem', flexShrink: 0, overflowY: 'auto' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', marginBottom: '2rem' }}>
        <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎵</div>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Soundfy</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '2rem' }}>
        <NavLink to="/" end style={navStyle}><HomeIcon /> Home</NavLink>
        <NavLink to="/search" style={navStyle}><SearchIcon /> Search</NavLink>
        <NavLink to="/favorites" style={navStyle}><HeartIcon /> Favorites</NavLink>
        <NavLink to="/playlists" style={navStyle}><PlaylistIcon /> Playlists</NavLink>
      </nav>

      {/* User */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--bg-hover)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{user?.name}</span>
        </div>
        <button onClick={logout} style={{ width: '100%', padding: '8px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-secondary)', borderRadius: 6, transition: 'all 0.15s' }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
