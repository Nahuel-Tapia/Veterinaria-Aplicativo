import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Form from './Form.jsx';
import TextField from './TextField.jsx';
import * as medicalRecordService from '../services/medicalRecordService.js';
import * as petService from '../services/petService.js';
import { useSnackbar } from './Snackbar.jsx';

export default function HistoriaClinicaForm() {
  const [searchParams] = useSearchParams();
  const initialPetUuid = searchParams.get('petUuid') || '';
  const initialAppointmentUuid = searchParams.get('appointmentUuid') || '';

  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    petUuid: initialPetUuid,
    appointmentUuid: initialAppointmentUuid,
    reason: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    weight: '',
    vaccinesAppliedText: ''
  });

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  useEffect(() => {
    petService.getPets().then(setPets).catch(() => setPets([]));
  }, []);

  function submit(e) {
    e?.preventDefault?.();
    if (!formData.petUuid) {
      return snackbar.enqueue('Seleccione la mascota', { variant: 'error' });
    }
    if (!formData.diagnosis) {
      return snackbar.enqueue('Ingrese el diagnóstico médico', { variant: 'error' });
    }

    const payload = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      vaccinesApplied: formData.vaccinesAppliedText ? formData.vaccinesAppliedText.split(',').map(v => v.trim()) : []
    };
    delete payload.vaccinesAppliedText;

    medicalRecordService.createMedicalRecord(payload)
      .then(() => {
        snackbar.enqueue('Consulta médica e historia clínica registrada con éxito', { variant: 'success' });
        navigate(`/mascota/${formData.petUuid}`);
      })
      .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
      <Form
        title="💉 Registrar Atención / Consulta Médica"
        onSubmit={submit}
        submitLabel="Guardar Ficha Clínica"
      >
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Mascota / Paciente</label>
          <select
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
            value={formData.petUuid}
            onChange={e => setFormData({ ...formData, petUuid: e.target.value })}
            required
          >
            <option value="">-- Seleccionar Paciente --</option>
            {pets.map(p => (
              <option key={p.uuid} value={p.uuid}>{p.name} ({p.species} - {p.breed || 'Sin raza'})</option>
            ))}
          </select>
        </div>

        <TextField
          label="Motivo de la Consulta"
          name="reason"
          value={formData.reason}
          onChange={e => setFormData({ ...formData, reason: e.target.value })}
        />

        <TextField
          label="Diagnóstico Médico *"
          name="diagnosis"
          required={true}
          value={formData.diagnosis}
          onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
        />

        <TextField
          label="Tratamiento / Procedimiento Realizado"
          name="treatment"
          value={formData.treatment}
          onChange={e => setFormData({ ...formData, treatment: e.target.value })}
        />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>💊 Receta Médica / Prescripción de Fármacos</label>
          <textarea
            style={{ width: '100%', padding: '8px', minHeight: '80px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
            placeholder="Ej: Amoxicilina 250mg cada 12hs por 7 días..."
            value={formData.prescription}
            onChange={e => setFormData({ ...formData, prescription: e.target.value })}
          />
        </div>

        <TextField
          label="Peso registrado en la consulta (kg)"
          name="weight"
          type="number"
          step="0.1"
          value={formData.weight}
          onChange={e => setFormData({ ...formData, weight: e.target.value })}
        />

        <TextField
          label="Vacunas Aplicadas (separadas por coma)"
          name="vaccinesAppliedText"
          placeholder="Ej: Antirrábica, Séxtuple"
          value={formData.vaccinesAppliedText}
          onChange={e => setFormData({ ...formData, vaccinesAppliedText: e.target.value })}
        />
      </Form>
    </div>
  );
}
