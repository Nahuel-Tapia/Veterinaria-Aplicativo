import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as petService from '../services/petService.js';
import Button from './Button.jsx';
import useModal from './Modal.jsx';
import { useSnackbar } from './Snackbar.jsx';

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('todas');

  const modal = useModal();
  const snackbar = useSnackbar();

  useEffect(() => {
    cargarMascotas();
  }, []);

  function cargarMascotas() {
    petService.getPets()
      .then(setMascotas)
      .catch(err => snackbar.enqueue(`Error al cargar mascotas: ${err.message}`, { variant: 'error' }));
  }

  function eliminar(uuid, nombre) {
    modal.open(
      `¿Confirma que desea eliminar la mascota ${nombre}?`,
      'Confirmar eliminación',
      {
        onYes: () => {
          petService.deletePet(uuid)
            .then(() => {
              snackbar.enqueue('Mascota eliminada', { variant: 'success' });
              cargarMascotas();
            })
            .catch(err => snackbar.enqueue(`Error: ${err.message}`, { variant: 'error' }));
          modal.close();
        }
      }
    );
  }

  // Filtrado reactivo en tiempo real
  const mascotasFiltradas = mascotas.filter(pet => {
    const matchesSpecies = selectedSpecies === 'todas' || pet.species?.toLowerCase() === selectedSpecies.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query || 
      pet.name?.toLowerCase().includes(query) ||
      pet.breed?.toLowerCase().includes(query) ||
      pet.microchip?.toLowerCase().includes(query);
    return matchesSpecies && matchesQuery;
  });

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>🐾 Mis Mascotas / Pacientes</h2>
        <Button>
          <Link to="/mascota/nueva" style={{ color: 'inherit', textDecoration: 'none' }}>
            + Registrar Mascota
          </Link>
        </Button>
      </div>

      {/* Barra de Búsqueda y Filtros de Especie */}
      <div style={{ background: '#222', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre de mascota, raza o microchip..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
            fontSize: '1rem',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#aaa', fontWeight: 'bold' }}>Filtrar especie:</span>
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'perro', label: '🐶 Perros' },
            { id: 'gato', label: '🐱 Gatos' },
            { id: 'ave', label: '🦜 Aves' },
            { id: 'exotico', label: '🐰 Exóticos' },
          ].map(spec => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecies(spec.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                background: selectedSpecies === spec.id ? '#4caf50' : '#3a3a3a',
                color: '#fff',
                transition: 'background 0.2s'
              }}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>

      {mascotasFiltradas.length === 0 ? (
        <div style={{ background: '#222', padding: '2rem', textAlign: 'center', borderRadius: '8px', color: '#aaa' }}>
          <p>No se encontraron mascotas que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {mascotasFiltradas.map(pet => (
            <div key={pet.uuid} style={{ background: '#262626', border: '1px solid #3d3d3d', borderRadius: '10px', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, color: '#4caf50' }}>{pet.name}</h3>
                  <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '12px', textTransform: 'capitalize' }}>
                    {pet.species}
                  </span>
                </div>
                <p style={{ margin: '0.3rem 0', color: '#ccc', fontSize: '0.9rem' }}>
                  <strong>Raza:</strong> {pet.breed || 'Mestizo/Sin especificar'}
                </p>
                <p style={{ margin: '0.3rem 0', color: '#ccc', fontSize: '0.9rem' }}>
                  <strong>Género:</strong> {pet.gender || '-'} | <strong>Peso:</strong> {pet.weight ? `${pet.weight} kg` : '-'}
                </p>
                {pet.microchip && (
                  <p style={{ margin: '0.3rem 0', color: '#888', fontSize: '0.8rem' }}>
                    <strong>Microchip:</strong> {pet.microchip}
                  </p>
                )}
                {pet.notes && (
                  <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#aaa', fontSize: '0.85rem' }}>
                    "{pet.notes}"
                  </p>
                )}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #333', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button style={{ fontSize: '0.85rem' }}>
                  <Link to={`/mascota/${pet.uuid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    📋 Ficha / Historia
                  </Link>
                </Button>
                <Button style={{ fontSize: '0.85rem' }}>
                  <Link to={`/mascota/editar/${pet.uuid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    ✏️ Editar
                  </Link>
                </Button>
                <Button style={{ fontSize: '0.85rem', background: '#c62828' }} onClick={() => eliminar(pet.uuid, pet.name)}>
                  🗑️
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
