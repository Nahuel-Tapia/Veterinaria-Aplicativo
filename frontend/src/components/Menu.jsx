import './Menu.css';
import { Link, useNavigate } from 'react-router-dom';
import useSession from './Session.jsx';

export default function Menu() {
  const session = useSession();
  const navigate = useNavigate();

  const roles = session.user?.roles || [];
  const isAdmin = roles.includes('admin');

  function logout() {
    localStorage.removeItem('session');
    session.setIsLoggedIn(false);
    session.setUser(null);
    navigate('/');
  }

  return (
    <nav className="menu">
      <ul>
        <li><Link to="/">🏠 Inicio</Link></li>
        {session.isLoggedIn ? (
          <>
            <li><Link to="/mascotas">🐾 Mascotas</Link></li>
            <li><Link to="/turnos">📅 Turnos</Link></li>
            <li><Link to="/turnos/solicitar">➕ Reservar Cita</Link></li>
            {isAdmin && (
              <>
                <li><Link to="/usuarios">👥 Usuarios</Link></li>
                <li><Link to="/servicios">🛠️ Servicios</Link></li>
              </>
            )}
            <li><Link to="#" onClick={logout}>🚪 Salir</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/register">📝 Registrarme</Link></li>
          </>
        )}
        <li><Link to="/about">ℹ️ Acerca de</Link></li>
      </ul>
    </nav>
  );
}