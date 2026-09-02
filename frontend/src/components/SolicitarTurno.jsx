import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Form from './Form.jsx';
import TextField from './TextField.jsx';
import * as appointmentService from '../services/appointmentService.js';
import * as petService from '../services/petService.js';
import * as serviceCatalogService from '../services/serviceCatalogService.js';
import { useSnackbar } from './Snackbar.jsx';

export default function SolicitarTurno() {
  const [searchParams] = useSearchParams();
  const initialPetUuid = searchParams.get('petUuid') || '';

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    petUuid: initialPetUuid,
    serviceUuid: '',
    date: '',
    reason: ''
  });

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  useEffect(() => {
    petService.getPets().then(setPets).catch(() => setPets([]));
    serviceCatalogService.getServices({ active: true }).then(setServices).catch(() => setServices([]));
  }, []);

  function submit(e) {
    e?.preventDefault?.();
    if (!formData.petUuid) {
      return snackbar.enqueue('Por favor seleccione una mascota', { variant: 'error' });
    }
    if (!formData.serviceUuid) {
      return snackbar.enqueue('Por favor seleccione un servicio', { variant: 'error' });
    }
    if (!formData.date) {
      return snackbar.enqueue('Por favor indique fecha y hora', { variant: 'error' });
    }

    appointmentService.createAppointment(formData)
      .then(() => {
        snackbar.enqueue('Turno agendado correctamente', { variant: 'success' });
        navigate('/turnos');
      })
      .catch(err => snackbar.enqueue(`Error al agendar turno: ${err.message}`, { variant: 'error' }));
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <Form
        title="Solicitar / Agendar Turno"
        onSubmit={submit}
        submitLabel="Agendar Cita"
      >
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Mascota / Paciente</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
            value={formData.petUuid}
            onChange={e => setFormData({ ...formData, petUuid: e.target.value })}
            required
          >
            <option value="">-- Seleccionar Mascota --</option>
            {pets.map(p => (
              <option key={p.uuid} value={p.uuid}>{p.name} ({p.species} - {p.breed || 'Sin raza'})</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Servicio Requerido</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
            value={formData.serviceUuid}
            onChange={e => setFormData({ ...formData, serviceUuid: e.target.value })}
            required
          >
            <option value="">-- Seleccionar Servicio --</option>
            {services.map(s => (
              <option key={s.uuid} value={s.uuid}>{s.name} — ${s.price} ({s.durationMinutes} min)</option>
            ))}
          </select>
        </div>

        <TextField
          label="Fecha y Hora elegida"
          name="date"
          type="datetime-local"
          required={true}
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
        />

        <TextField
          label="Motivo de la consulta / Observaciones"
          name="reason"
          value={formData.reason}
          onChange={e => setFormData({ ...formData, reason: e.target.value })}
        />
      </Form>
    </div>
  );
}
