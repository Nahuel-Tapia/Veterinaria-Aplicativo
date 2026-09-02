import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as serviceCatalogService from '../services/serviceCatalogService.js';
import Button from './Button.jsx';
import useModal from './Modal.jsx';
import { useSnackbar } from './Snackbar.jsx';

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const modal = useModal();
  const snackbar = useSnackbar();

  useEffect(() => {
    cargarServicios();
  }, []);

  function cargarServicios() {
    serviceCatalogService.getServices()
      .then(setServicios)
      .catch(err => snackbar.enqueue(`Error al cargar catálogo: ${err.message}`, { variant: 'error' }));
  }

  function toggleEstado(serv) {
    serviceCatalogService.updateService(serv.uuid, { active: !serv.active })
      .then(() => {
        snackbar.enqueue('Estado del servicio actualizado', { variant: 'success' });
        cargarServicios();
      })
      .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
  }

  function eliminar(uuid, nombre) {
    modal.open(
      `¿Confirma que desea eliminar el servicio ${nombre}?`,
      'Eliminar Servicio',
      {
        onYes: () => {
          serviceCatalogService.deleteService(uuid)
            .then(() => {
              snackbar.enqueue('Servicio eliminado del catálogo', { variant: 'success' });
              cargarServicios();
            })
            .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
          modal.close();
        }
      }
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>🛠️ Catálogo de Servicios y Tarifas</h2>
        <Button>
          <Link to="/servicio/nuevo" style={{ color: 'inherit', textDecoration: 'none' }}>
            + Nuevo Servicio
          </Link>
        </Button>
      </div>

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Nombre del Servicio</th>
            <th style={{ padding: '10px' }}>Duración</th>
            <th style={{ padding: '10px' }}>Precio</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.uuid} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '10px' }}>
                <strong>{s.name}</strong>
                {s.description && <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{s.description}</div>}
              </td>
              <td style={{ padding: '10px' }}>{s.durationMinutes} min</td>
              <td style={{ padding: '10px', color: '#81c784', fontWeight: 'bold' }}>${s.price}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  background: s.active ? '#2e7d32' : '#757575'
                }}>
                  {s.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Button style={{ fontSize: '0.8rem' }} onClick={() => toggleEstado(s)}>
                    {s.active ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button style={{ fontSize: '0.8rem' }}>
                    <Link to={`/servicio/editar/${s.uuid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      Editar
                    </Link>
                  </Button>
                  <Button style={{ fontSize: '0.8rem', background: '#d32f2f' }} onClick={() => eliminar(s.uuid, s.name)}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {servicios.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem', color: '#888' }}>
                No hay servicios registrados en el catálogo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
