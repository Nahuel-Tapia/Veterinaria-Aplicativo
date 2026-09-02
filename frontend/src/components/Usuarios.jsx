import { useState, useEffect } from 'react';
import * as userService from '../services/userService.js';
import Button from './Button.jsx';
import { Link } from 'react-router-dom';
import useModal from './Modal.jsx';
import { useSnackbar } from './Snackbar.jsx';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const modal = useModal();
  const snackbar = useSnackbar();

  useEffect(() => {
    userService.get()
      .then(setUsuarios)
      .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
  }, []);

  function deleteUsuario(uuid) {
    modal.open(
      '¿Confirma que desea eliminar este usuario?',
      'Confirmar eliminación',
      {
        onYes: () => {
          userService.deleteUser(uuid)
            .then(() => {
              snackbar.enqueue('Usuario eliminado', { variant: 'success' });
              userService.get().then(setUsuarios);
            })
            .catch(err => {
              snackbar.enqueue(`Error al eliminar el usuario: ${err.message}`, { variant: 'error' });
            });

          modal.close();
        },
      }
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Gestión de Usuarios y Personal</h3>
        <Button>
          <Link to="/usuario" style={{ color: 'inherit', textDecoration: 'none' }}>
            + Nuevo Usuario
          </Link>
        </Button>
      </div>

      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', color: '#fff' }}>
            <th style={{ padding: '8px' }}>Usuario</th>
            <th style={{ padding: '8px' }}>Nombre completo</th>
            <th style={{ padding: '8px' }}>Email</th>
            <th style={{ padding: '8px' }}>Teléfono</th>
            <th style={{ padding: '8px' }}>Roles</th>
            <th style={{ padding: '8px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.uuid} style={{ borderBottom: '1px solid #444' }}>
              <td style={{ padding: '8px' }}>{u.username}</td>
              <td style={{ padding: '8px' }}>{u.fullName}</td>
              <td style={{ padding: '8px' }}>{u.email}</td>
              <td style={{ padding: '8px' }}>{u.phone || '-'}</td>
              <td style={{ padding: '8px' }}>{u.roles?.join(', ')}</td>
              <td style={{ padding: '8px' }}>
                <Button style={{ marginRight: '0.5rem' }}>
                  <Link to={`/usuario/${u.uuid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    Editar
                  </Link>
                </Button>
                <Button onClick={() => deleteUsuario(u.uuid)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}