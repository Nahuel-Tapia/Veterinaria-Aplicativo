import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as petService from '../services/petService.js';
import * as medicalRecordService from '../services/medicalRecordService.js';
import { useSession } from './Session.jsx';
import Button from './Button.jsx';
import { useSnackbar } from './Snackbar.jsx';

export default function MascotaDetalle() {
  const { uuid } = useParams();
  const [pet, setPet] = useState(null);
  const [records, setRecords] = useState([]);
  const session = useSession();
  const snackbar = useSnackbar();

  const roles = session.user?.roles || [];
  const isStaff = roles.includes('admin') || roles.includes('vet');

  useEffect(() => {
    petService.getPet(uuid)
      .then(setPet)
      .catch(err => snackbar.enqueue(`Error al cargar la mascota: ${err.message}`, { variant: 'error' }));

    medicalRecordService.getMedicalRecords({ petUuid: uuid })
      .then(setRecords)
      .catch(() => setRecords([]));
  }, [uuid]);

  function imprimirReceta(rec) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Por favor permita las ventanas emergentes para imprimir la receta.');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receta Médica Veterinario - VetCare Pro</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { border-bottom: 3px solid #4caf50; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-space-between; align-items: center; }
            .title { font-size: 24px; font-weight: bold; color: #2e7d32; margin: 0; }
            .subtitle { color: #666; font-size: 14px; margin: 5px 0 0 0; }
            .box { border: 1px solid #ddd; padding: 15px; border-radius: 6px; background: #f9f9f9; margin-bottom: 20px; }
            .section-title { font-weight: bold; color: #2e7d32; font-size: 16px; margin-top: 15px; margin-bottom: 5px; }
            .prescription { white-space: pre-wrap; font-family: 'Courier New', Courier, monospace; background: #fff; padding: 15px; border: 1px dashed #4caf50; border-radius: 6px; font-size: 15px; }
            .footer { margin-top: 50px; text-align: center; border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #777; }
            .signature { margin-top: 40px; text-align: right; }
            .sig-line { display: inline-block; width: 200px; border-top: 1px solid #333; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">🐾 VetCare Pro — Receta Médica</h1>
              <p class="subtitle">Clínica & Atención Veterinaria</p>
            </div>
            <div>Fecha: ${new Date(rec.date).toLocaleDateString()}</div>
          </div>

          <div class="box">
            <strong>Paciente / Mascota:</strong> ${pet.name} (${pet.species} - ${pet.breed || 'Mestizo'})<br/>
            <strong>Peso Registrado:</strong> ${rec.weight ? `${rec.weight} kg` : (pet.weight ? `${pet.weight} kg` : 'N/D')}<br/>
            <strong>Diagnóstico:</strong> ${rec.diagnosis}
          </div>

          <div class="section-title">💊 Indicaciones & Prescripción Médica:</div>
          <div class="prescription">${rec.prescription || 'Sin prescripción indicada.'}</div>

          ${rec.treatment ? `<div class="section-title">🩺 Tratamiento Aplicado:</div><p>${rec.treatment}</p>` : ''}
          ${rec.vaccinesApplied && rec.vaccinesApplied.length > 0 ? `<div class="section-title">💉 Vacunas Aplicadas:</div><p>${rec.vaccinesApplied.join(', ')}</p>` : ''}

          <div class="signature">
            <div class="sig-line">Firma y Sello del Profesional</div>
          </div>

          <div class="footer">
            VetCare Pro — Documento generado electrónicamente.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  if (!pet) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos de la mascota...</div>;
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Tarjeta de Ficha de Mascota */}
      <div style={{ background: '#222', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem', borderLeft: '6px solid #4caf50' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#4caf50' }}>🐾 {pet.name}</h2>
            <p style={{ margin: '0.2rem 0', color: '#bbb' }}>
              <strong>Especie:</strong> {pet.species} | <strong>Raza:</strong> {pet.breed || 'Sin especificar'}
            </p>
            <p style={{ margin: '0.2rem 0', color: '#bbb' }}>
              <strong>Género:</strong> {pet.gender || '-'} | <strong>Peso:</strong> {pet.weight ? `${pet.weight} kg` : 'Sin registrar'}
            </p>
            {pet.birthDate && <p style={{ margin: '0.2rem 0', color: '#bbb' }}><strong>Nacimiento:</strong> {pet.birthDate}</p>}
            {pet.microchip && <p style={{ margin: '0.2rem 0', color: '#bbb' }}><strong>Microchip:</strong> {pet.microchip}</p>}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Button>
              <Link to={`/turnos/solicitar?petUuid=${pet.uuid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                📅 Solicitar Turno
              </Link>
            </Button>
            {isStaff && (
              <Button style={{ background: '#2196f3' }}>
                <Link to={`/historia-clinica/nueva?petUuid=${pet.uuid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  💉 Agregar Consulta Médica
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Historial Médico */}
      <div>
        <h3 style={{ borderBottom: '2px solid #444', paddingBottom: '0.5rem' }}>📑 Historia Clínica y Registro Vacunal</h3>
        {records.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Esta mascota aún no tiene consultas o tratamientos registrados.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {records.map(rec => (
              <div key={rec.uuid} style={{ background: '#2b2b2b', padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>📅 {new Date(rec.date).toLocaleDateString()} — {new Date(rec.date).toLocaleTimeString()}</span>
                  {rec.weight && <span>⚖️ Peso: {rec.weight} kg</span>}
                </div>
                {rec.reason && <p style={{ margin: '0.3rem 0' }}><strong>Motivo de Consulta:</strong> {rec.reason}</p>}
                <p style={{ margin: '0.3rem 0', color: '#e0e0e0' }}><strong>Diagnóstico:</strong> {rec.diagnosis}</p>
                {rec.treatment && <p style={{ margin: '0.3rem 0', color: '#ccc' }}><strong>Tratamiento Aplicado:</strong> {rec.treatment}</p>}
                
                {rec.prescription && (
                  <div style={{ background: '#1e1e1e', padding: '0.8rem', borderRadius: '6px', marginTop: '0.5rem', border: '1px dashed #555' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <strong style={{ color: '#ffb74d' }}>💊 Receta Médica / Prescripción:</strong>
                      <Button style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#388e3c' }} onClick={() => imprimirReceta(rec)}>
                        🖨️ Imprimir Receta
                      </Button>
                    </div>
                    <p style={{ margin: '0.3rem 0 0 0', whiteSpace: 'pre-line' }}>{rec.prescription}</p>
                  </div>
                )}
                
                {rec.vaccinesApplied && rec.vaccinesApplied.length > 0 && (
                  <div style={{ marginTop: '0.5rem', color: '#81c784' }}>
                    <strong>💉 Vacunas aplicadas:</strong> {rec.vaccinesApplied.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
