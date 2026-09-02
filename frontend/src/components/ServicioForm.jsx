import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from './Form.jsx';
import TextField from './TextField.jsx';
import * as serviceCatalogService from '../services/serviceCatalogService.js';
import { useSnackbar } from './Snackbar.jsx';

export default function ServicioForm() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [data, setData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    price: '',
    active: true
  });

  useEffect(() => {
    if (uuid) {
      serviceCatalogService.getService(uuid)
        .then(res => {
          if (res) setData(res);
        })
        .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
    }
  }, [uuid]);

  function submit(e) {
    e?.preventDefault?.();
    const payload = {
      ...data,
      durationMinutes: parseInt(data.durationMinutes) || 30,
      price: parseFloat(data.price) || 0
    };

    if (uuid) {
      serviceCatalogService.updateService(uuid, payload)
        .then(() => {
          snackbar.enqueue('Servicio actualizado correctamente', { variant: 'success' });
          navigate('/servicios');
        })
        .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
    } else {
      serviceCatalogService.createService(payload)
        .then(() => {
          snackbar.enqueue('Servicio creado con éxito', { variant: 'success' });
          navigate('/servicios');
        })
        .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <Form
        title={uuid ? 'Editar Servicio / Prestación' : 'Nuevo Servicio'}
        onSubmit={submit}
      >
        <TextField
          label="Nombre del Servicio *"
          name="name"
          required={true}
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
        />

        <TextField
          label="Descripción"
          name="description"
          value={data.description}
          onChange={e => setData({ ...data, description: e.target.value })}
        />

        <TextField
          label="Duración Estimada (minutos)"
          name="durationMinutes"
          type="number"
          required={true}
          value={data.durationMinutes}
          onChange={e => setData({ ...data, durationMinutes: e.target.value })}
        />

        <TextField
          label="Precio ($ ARS / USD)"
          name="price"
          type="number"
          step="0.01"
          required={true}
          value={data.price}
          onChange={e => setData({ ...data, price: e.target.value })}
        />

        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="active"
            checked={data.active}
            onChange={e => setData({ ...data, active: e.target.checked })}
          />
          <label htmlFor="active">Servicio activo (disponible para reserva online)</label>
        </div>
      </Form>
    </div>
  );
}
