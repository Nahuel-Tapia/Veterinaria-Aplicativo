import MenuIcon from './MenuIcon.jsx';
import { useSession } from './Session.jsx';

export default function Head({ setMenuShowed }) {
  const session = useSession();

  return (
    <div
      className="head"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        padding: '0.5rem 1rem',
        borderBottom: '2px solid #4caf50',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <MenuIcon onClick={() => setMenuShowed(value => !value)} />
        <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#4caf50' }}>
          🐾 VetCare Pro
        </h1>
      </div>
      <div style={{ fontSize: '0.95rem', color: '#ddd' }}>
        {session.isLoggedIn ? (
          <span>👤 {session.user?.fullName || session.user?.username}</span>
        ) : (
          <span>Invitado</span>
        )}
      </div>
    </div>
  );
}