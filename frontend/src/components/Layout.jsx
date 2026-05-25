import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from './Player';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{
          flex: 1, overflowY: 'auto',
          background: 'linear-gradient(180deg, #1a1a2e 0%, var(--bg) 40%)',
          padding: '1.5rem',
          paddingBottom: 'calc(var(--player-height) + 60px)'
        }}>
          <Outlet />
        </main>
      </div>
      <Player />
      <MobileNav />
    </div>
  );
}
