import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from './Form.jsx';
import TextField from './TextField.jsx';
import { register } from '../services/loginService.js';
import { useSnackbar } from './Snackbar.jsx';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dni: ''
  });
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  async function submit(e) {
    e?.preventDefault?.();
    try {
      await register(formData);
      snackbar.enqueue('Registro exitoso. ¡Ya puedes iniciar sesión!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      snackbar.enqueue(`Error al registrarse: ${err.message}`, { variant: 'error' });
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem' }}>
      <Form
        title="Registro de Cliente / Dueño de Mascota"
        onSubmit={submit}
        submitLabel="Registrarme"
      >
        <TextField
          label="Nombre de usuario"
          name="username"
          required={true}
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          required={true}
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
        />
        <TextField
          label="Nombre y Apellido completo"
          name="fullName"
          required={true}
          value={formData.fullName}
          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
        />
        <TextField
          label="Correo electrónico"
          name="email"
          type="email"
          required={true}
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          label="Teléfono de contacto"
          name="phone"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
        />
        <TextField
          label="Dirección"
          name="address"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
        />
        <TextField
          label="DNI / Documento"
          name="dni"
          value={formData.dni}
          onChange={e => setFormData({ ...formData, dni: e.target.value })}
        />
      </Form>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        ¿Ya tienes cuenta? <Link to="/" style={{ color: '#4caf50' }}>Inicia sesión aquí</Link>
      </div>
    </div>
  );
}
