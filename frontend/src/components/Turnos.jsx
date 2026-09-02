import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as appointmentService from '../services/appointmentService.js';
import * as petService from '../services/petService.js';
import * as serviceCatalogService from '../services/serviceCatalogService.js';
import { useSession } from './Session.jsx';
import Button from './Button.jsx';
import useModal from './Modal.jsx';
import { useSnackbar } from './Snackbar.jsx';

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [petsMap, setPetsMap] = useState({});
  const [servicesMap, setServicesMap] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  
  const session = useSession();
  const modal = useModal();
  const snackbar = useSnackbar();

  const roles = session.user?.roles || [];
  const isStaff = roles.includes('admin') || roles.includes('vet');

  useEffect(() => {
    cargarDatos();
  }, [filterStatus]);

  function cargarDatos() {
    const query = filterStatus ? { status: filterStatus } : {};
    
    Promise.all([
      appointmentService.getAppointments(query),
      petService.getPets().catch(() => []),
      serviceCatalogService.getServices().catch(() => [])
    ]).then(([appointments, pets, services]) => {
      setTurnos(appointments);
      
      const pMap = {};
      pets.forEach(p => pMap[p.uuid] = p);
      setPetsMap(pMap);

      const sMap = {};
      services.forEach(s => sMap[s.uuid] = s);
      setServicesMap(sMap);
    }).catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
  }

  function cambiarEstado(uuid, nuevoEstado) {
    appointmentService.updateAppointment(uuid, { status: nuevoEstado })
      .then(() => {
        snackbar.enqueue(`Estado del turno actualizado a: ${nuevoEstado}`, { variant: 'success' });
        cargarDatos();
      })
      .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
  }

  function cancelarTurno(uuid) {
    modal.open(
      '¿Confirma que desea cancelar este turno?',
      'Cancelar Turno',
      {
        onYes: () => {
          cambiarEstado(uuid, 'cancelled');
          modal.close();
        }
      }
    );
  }

  const statusBadge = (st) => {
    const map = {
      pending: { label: 'Pendiente', bg: '#ef6c00' },
      confirmed: { label: 'Confirmado', bg: '#2e7d32' },
      in_progress: { label: 'En Atención', bg: '#0288d1' },
      completed: { label: 'Completado', bg: '#388e3c' },
      cancelled: { label: 'Cancelado', bg: '#d32f2f' }
    };
    const conf = map[st] || { label: st, bg: '#555' };
    return (
      <span style={{ padding: '4px 10px', borderRadius: '12px', background: conf.bg, color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
        {conf.label}
      </span>
    );
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h2>📅 Agenda de Turnos y Citas</h2>
        <Button>
          <Link to="/turnos/solicitar" style={{ color: 'inherit', textDecoration: 'none' }}>
            + Solicitar Nuevo Turno
          </Link>
        </Button>
      </div>

      {/* Filtro por estado */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <label><strong>Filtrar por estado:</strong></label>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '6px 12px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
        >
          <option value="">Todos los turnos</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="in_progress">En Atención</option>
          <option value="completed">Completados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Fecha y Hora</th>
            <th style={{ padding: '10px' }}>Mascota</th>
            <th style={{ padding: '10px' }}>Servicio</th>
            <th style={{ padding: '10px' }}>Motivo</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map(t => {
            const pet = petsMap[t.petUuid];
            const srv = servicesMap[t.serviceUuid];
            return (
              <tr key={t.uuid} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '10px' }}>{new Date(t.date).toLocaleString()}</td>
                <td style={{ padding: '10px' }}>
                  <strong>{pet?.name || 'Mascota'}</strong> ({pet?.species || 'N/D'})
                </td>
                <td style={{ padding: '10px' }}>{srv?.name || 'Servicio'}</td>
                <td style={{ padding: '10px', fontSize: '0.9rem', color: '#ccc' }}>{t.reason || '-'}</td>
                <td style={{ padding: '10px' }}>{statusBadge(t.status)}</td>
                <td style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {isStaff && t.status === 'pending' && (
                      <Button style={{ fontSize: '0.8rem', background: '#2e7d32' }} onClick={() => cambiarEstado(t.uuid, 'confirmed')}>
                        Confirmar
                      </Button>
                    )}
                    {isStaff && (t.status === 'confirmed' || t.status === 'pending') && (
                      <Button style={{ fontSize: '0.8rem', background: '#0288d1' }}>
                        <Link to={`/historia-clinica/nueva?petUuid=${t.petUuid}&appointmentUuid=${t.uuid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          Atender (Consulta)
                        </Link>
                      </Button>
                    )}
                    {t.status !== 'completed' && t.status !== 'cancelled' && (
                      <Button style={{ fontSize: '0.8rem', background: '#d32f2f' }} onClick={() => cancelarTurno(t.uuid)}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {turnos.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: '#888' }}>
                No se encontraron turnos agendados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
