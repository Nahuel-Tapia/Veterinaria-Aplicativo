import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from './Form.jsx';
import TextField from './TextField.jsx';
import * as petService from '../services/petService.js';
import * as userService from '../services/userService.js';
import { useSession } from './Session.jsx';
import { useSnackbar } from './Snackbar.jsx';

export default function MascotaForm() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const snackbar = useSnackbar();

  const [data, setData] = useState({
    name: '',
    species: 'perro',
    breed: '',
    birthDate: '',
    gender: 'macho',
    weight: '',
    neutered: false,
    microchip: '',
    notes: '',
    ownerUuid: ''
  });

  const [owners, setOwners] = useState([]);
  const roles = session.user?.roles || [];
  const isStaff = roles.includes('admin') || roles.includes('vet');

  useEffect(() => {
    if (isStaff) {
      userService.get().then(users => {
        setOwners(users.filter(u => u.roles?.includes('client') || u.roles?.includes('admin')));
      }).catch(err => console.error(err));
    }

    if (uuid) {
      petService.getPet(uuid)
        .then(res => {
          if (res) setData(res);
        })
        .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
    }
  }, [uuid, isStaff]);

  function submit(e) {
    e?.preventDefault?.();
    if (uuid) {
      petService.updatePet(uuid, data)
        .then(() => {
          snackbar.enqueue('Mascota actualizada con éxito', { variant: 'success' });
          navigate('/mascotas');
        })
        .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
    } else {
      petService.createPet(data)
        .then(() => {
          snackbar.enqueue('Mascota registrada exitosamente', { variant: 'success' });
          navigate('/mascotas');
        })
        .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <Form
        title={uuid ? 'Editar Ficha de Mascota' : 'Registrar Mascota'}
        onSubmit={submit}
      >
        <TextField
          label="Nombre de la Mascota"
          name="name"
          required={true}
          value={data.name || ''}
          onChange={e => setData({ ...data, name: e.target.value })}
        />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Especie</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
            value={data.species || 'perro'}
            onChange={e => setData({ ...data, species: e.target.value })}
          >
            <option value="perro">Perro 🐶</option>
            <option value="gato">Gato 🐱</option>
            <option value="ave">Ave 🦜</option>
            <option value="exotico">Exótico 🐰 / 🐢</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <TextField
          label="Raza"
          name="breed"
          value={data.breed || ''}
          onChange={e => setData({ ...data, breed: e.target.value })}
        />

        <TextField
          label="Fecha de Nacimiento"
          name="birthDate"
          type="date"
          value={data.birthDate || ''}
          onChange={e => setData({ ...data, birthDate: e.target.value })}
        />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Género</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
            value={data.gender || 'macho'}
            onChange={e => setData({ ...data, gender: e.target.value })}
          >
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>

        <TextField
          label="Peso actual (kg)"
          name="weight"
          type="number"
          step="0.1"
          value={data.weight || ''}
          onChange={e => setData({ ...data, weight: parseFloat(e.target.value) || '' })}
        />

        <TextField
          label="Código de Microchip (opcional)"
          name="microchip"
          value={data.microchip || ''}
          onChange={e => setData({ ...data, microchip: e.target.value })}
        />

        {isStaff && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Dueño / Cliente Asignado</label>
            <select
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
              value={data.ownerUuid || ''}
              onChange={e => setData({ ...data, ownerUuid: e.target.value })}
            >
              <option value="">-- Seleccionar Propietario --</option>
              {owners.map(o => (
                <option key={o.uuid} value={o.uuid}>{o.fullName} ({o.username})</option>
              ))}
            </select>
          </div>
        )}

        <TextField
          label="Notas u Observaciones generales"
          name="notes"
          value={data.notes || ''}
          onChange={e => setData({ ...data, notes: e.target.value })}
        />
      </Form>
    </div>
  );
}
