import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from './Form.jsx';
import TextField from './TextField.jsx';
import MultiSelect from './MultiSelectField.jsx';
import * as userService from '../services/userService.js';
import { useSnackbar } from './Snackbar.jsx';

export default function Usuario() {
  const { uuid } = useParams();
  const [data, setData] = useState({ roles: ['client'] });
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (uuid) {
      userService.get({ uuid })
        .then(res => setData(res[0] || {}))
        .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
    }
  }, [uuid]);

  function submit(e) {
    e.preventDefault();
    if (uuid) {
      userService.patch(uuid, data)
        .then(() => {
          snackbar.enqueue('Usuario actualizado correctamente', { variant: 'success' });
          navigate('/usuarios');
        })
        .catch(err => {
          snackbar.enqueue(`Error al actualizar usuario: ${err.message}`, { variant: 'error' });
        });
    } else {
      userService.post(data)
        .then(() => {
          snackbar.enqueue('Usuario creado exitosamente', { variant: 'success' });
          navigate('/usuarios');
        })
        .catch(err => {
          snackbar.enqueue(`Error al crear usuario: ${err.message}`, { variant: 'error' });
        });
    }
  }

  return (
    <Form
      title={uuid ? 'Editar Usuario / Personal' : 'Nuevo Usuario'}
      onSubmit={submit}
    >
      <TextField
        label="Nombre completo"
        name="fullName"
        required={true}
        value={data.fullName || ''}
        onChange={e => setData({ ...data, fullName: e.target.value })}
      />

      <TextField
        label="Nombre de usuario"
        name="username"
        required={true}
        value={data.username || ''}
        onChange={e => setData({ ...data, username: e.target.value })}
      />

      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        required={true}
        value={data.email || ''}
        onChange={e => setData({ ...data, email: e.target.value })}
      />

      <TextField
        label="Teléfono de contacto"
        name="phone"
        value={data.phone || ''}
        onChange={e => setData({ ...data, phone: e.target.value })}
      />

      <TextField
        label="Dirección"
        name="address"
        value={data.address || ''}
        onChange={e => setData({ ...data, address: e.target.value })}
      />

      <TextField
        label="DNI / Documento"
        name="dni"
        value={data.dni || ''}
        onChange={e => setData({ ...data, dni: e.target.value })}
      />

      <MultiSelect
        label="Roles de acceso"
        name="roles"
        options={[
          { value: 'admin',  label: 'Administrador (Gestión total)' },
          { value: 'vet',    label: 'Veterinario / Médico' },
          { value: 'client', label: 'Cliente (Dueño de mascota)' },
        ]}
        value={data.roles || []}
        onChange={selected => setData({ ...data, roles: selected })}
      />

      <TextField
        label={uuid ? 'Cambiar contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
        name="password"
        type="password"
        required={!uuid}
        value={data.password || ''}
        onChange={e => setData({ ...data, password: e.target.value })}
      />
    </Form>
  );
}