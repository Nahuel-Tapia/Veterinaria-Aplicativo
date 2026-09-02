import { useState, useEffect } from 'react';
import { useSession } from './Session.jsx';
import { Link } from 'react-router-dom';
import * as petService from '../services/petService.js';
import * as appointmentService from '../services/appointmentService.js';
import * as serviceCatalogService from '../services/serviceCatalogService.js';
import Button from './Button.jsx';

export default function Dashboard() {
  const session = useSession();
  const [stats, setStats] = useState({
    petsCount: 0,
    appointmentsCount: 0,
    servicesCount: 0,
    pendingAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  const roles = session.user?.roles || [];
  const isAdmin = roles.includes('admin');
  const isVet = roles.includes('vet');
  const isClient = roles.includes('client');

  useEffect(() => {
    if (session.isLoggedIn) {
      Promise.all([
        petService.getPets().catch(() => []),
        appointmentService.getAppointments().catch(() => []),
        serviceCatalogService.getServices().catch(() => [])
      ]).then(([pets, appointments, services]) => {
        setStats({
          petsCount: pets.length,
          appointmentsCount: appointments.length,
          servicesCount: services.length,
          pendingAppointments: appointments.filter(a => a.status === 'pending').length
        });
        setRecentAppointments(appointments.slice(0, 5));
      });
    }
  }, [session.isLoggedIn]);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2> Bienvenido, {session.user?.fullName || session.user?.username || 'Usuario'}</h2>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Panel de Control VetCare Pro — Rol activo: <strong>{roles.join(', ') || 'Invitado'}</strong>
      </p>

      {/* Tarjetas de Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#2a2a2a', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>🐾 Mascotas Registradas</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.petsCount}</span>
        </div>
        <div style={{ background: '#2a2a2a', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>📅 Total de Turnos</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.appointmentsCount}</span>
        </div>
        <div style={{ background: '#2a2a2a', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>⏳ Turnos Pendientes</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pendingAppointments}</span>
        </div>
        {isAdmin && (
          <div style={{ background: '#2a2a2a', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #9c27b0' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#888' }}>🏥 Servicios en Catálogo</h4>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.servicesCount}</span>
          </div>
        )}
      </div>

      {/* Accesos Rápidos según Rol */}
      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>🚀 Accesos Rápidos</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Button><Link to="/mascotas" style={{ color: 'inherit', textDecoration: 'none' }}>🐾 Mis / Ver Mascotas</Link></Button>
          <Button><Link to="/turnos" style={{ color: 'inherit', textDecoration: 'none' }}>📅 Ver Agenda de Turnos</Link></Button>
          <Button><Link to="/turnos/solicitar" style={{ color: 'inherit', textDecoration: 'none' }}>➕ Solicitar / Reservar Turno</Link></Button>
          {isAdmin && (
            <>
              <Button><Link to="/usuarios" style={{ color: 'inherit', textDecoration: 'none' }}>👥 Gestión de Usuarios</Link></Button>
              <Button><Link to="/servicios" style={{ color: 'inherit', textDecoration: 'none' }}>🛠️ Catálogo de Servicios</Link></Button>
            </>
          )}
        </div>
      </div>

      {/* Próximos Turnos */}
      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '8px' }}>
        <h3>📅 Próximos Turnos Recientes</h3>
        {recentAppointments.length === 0 ? (
          <p style={{ color: '#888' }}>No hay turnos agendados en este momento.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#333', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Fecha</th>
                <th style={{ padding: '8px' }}>Estado</th>
                <th style={{ padding: '8px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map(app => (
                <tr key={app.uuid} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '8px' }}>{new Date(app.date).toLocaleString()}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      background: app.status === 'confirmed' ? '#2e7d32' : app.status === 'pending' ? '#ef6c00' : '#424242'
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <Link to="/turnos" style={{ color: '#646cff' }}>Ver detalles</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
