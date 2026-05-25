import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';

const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33z"/></svg>;
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.076-5.816c0-5.14-4.226-9.28-9.406-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"/></svg>;
const HeartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.593c-.525-.438-1.043-.862-1.51-1.25l-.05-.041C7.117 17.656 4.35 15.44 2.826 13.1 1.165 10.56.743 8.34 1.38 6.687c.529-1.378 1.672-2.356 3.058-2.63.982-.193 2.099-.043 3.043.5.748.432 1.424 1.096 1.99 1.944C9.944 5.48 10.607 4.8 11.36 4.356c.95-.547 2.067-.696 3.047-.5 1.386.274 2.529 1.252 3.059 2.63.636 1.655.214 3.873-1.447 6.413-1.523 2.34-4.29 4.556-7.614 7.202l-.05.041c-.468.388-.987.812-1.512 1.25l-.05.041z"/></svg>;
const PlaylistIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zM4 11a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2H4z"/></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 8.59c0 .81-.67 1.41-1.5 1.41H4.5C3.67 20 3 19.4 3 18.59c0-3.31 4.03-6 9-6s9 2.69 9 6z"/></svg>;

const mobileNavStyle = ({ isActive }) => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
  fontSize: 10, fontWeight: isActive ? 700 : 400, flex: 1, padding: '8px 0',
});

export default function MobileNav() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#0a0a0a', borderTop: '1px solid #222',
        zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
      }} className="mobile-nav">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" end style={mobileNavStyle}>
            <HomeIcon /><span>Home</span>
          </NavLink>
          <NavLink to="/search" style={mobileNavStyle}>
            <SearchIcon /><span>Search</span>
          </NavLink>
          {user ? (
            <>
              <NavLink to="/favorites" style={mobileNavStyle}>
                <HeartIcon /><span>Favorites</span>
              </NavLink>
              <NavLink to="/playlists" style={mobileNavStyle}>
                <PlaylistIcon /><span>Playlists</span>
              </NavLink>
            </>
          ) : (
            <button onClick={() => setShowAuth(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 10, flex: 1, padding: '8px 0', background: 'none' }}>
              <UserIcon /><span>Log in</span>
            </button>
          )}
        </div>
      </nav>

      {showAuth && <AuthModal tab="login" onClose={() => setShowAuth(false)} />}

      <style>{`
        @media (max-width: 768px) {
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </>
  );
}
