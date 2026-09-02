import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Share, Alert } from 'react-native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';

export interface PetDetailScreenProps {
  readonly route: any;
  readonly navigation: any;
}

export const PetDetailScreen: React.FC<PetDetailScreenProps> = ({ route, navigation }) => {
  const { petUuid } = route.params;
  const { user } = useAuth();

  const [pet, setPet] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const isStaff = user?.roles?.some(r => ['admin', 'vet'].includes(r));

  useEffect(() => {
    loadPetData();
  }, [petUuid]);

  async function loadPetData() {
    try {
      setRefreshing(true);
      const [petData, recordsData] = await Promise.all([
        api.get(`/pet/${petUuid}`),
        api.get('/medical-record', { petUuid }),
      ]);
      setPet(petData);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  async function sharePrescription(rec: any) {
    try {
      const message = `🐾 *VetCare Pro — Receta Médica*\nPaciente: ${pet.name} (${pet.species})\nFecha: ${new Date(rec.date).toLocaleDateString()}\nDiagnóstico: ${rec.diagnosis}\n\n💊 *Prescripción:*\n${rec.prescription}`;
      await Share.share({ message });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  if (!pet) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Cargando datos de la mascota...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadPetData} tintColor={theme.colors.primary} />}
    >
      <Card borderLeftColor={theme.colors.primary}>
        <Text style={styles.petName}>🐾 {pet.name}</Text>
        <Text style={styles.detailText}>Especie: {pet.species} | Raza: {pet.breed || 'Mestizo'}</Text>
        <Text style={styles.detailText}>Género: {pet.gender || '-'} | Peso: {pet.weight ? `${pet.weight} kg` : 'Sin registrar'}</Text>
        {pet.notes && <Text style={styles.notesText}>"{pet.notes}"</Text>}

        <View style={styles.buttonGroup}>
          <Button
            title="📅 Solicitar Turno"
            onPress={() => navigation.navigate('BookAppointment', { petUuid: pet.uuid })}
          />
          {isStaff && (
            <Button
              title="💉 Agregar Consulta Médica"
              onPress={() => navigation.navigate('AddMedicalRecord', { petUuid: pet.uuid })}
              variant="secondary"
            />
          )}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>📑 Historia Clínica y Vacunas</Text>

      {records.length === 0 ? (
        <Text style={styles.emptyText}>No hay registros médicos anteriores para esta mascota.</Text>
      ) : (
        records.map(rec => (
          <Card key={rec.uuid} borderLeftColor={theme.colors.secondary}>
            <View style={styles.recordHeader}>
              <Text style={styles.dateText}>📅 {new Date(rec.date).toLocaleDateString()}</Text>
              {rec.weight && <Text style={styles.weightText}>⚖️ {rec.weight} kg</Text>}
            </View>

            {rec.reason && <Text style={styles.recordDetail}>Motivo: {rec.reason}</Text>}
            <Text style={styles.recordDiagnosis}>Diagnóstico: {rec.diagnosis}</Text>
            {rec.treatment && <Text style={styles.recordDetail}>Tratamiento: {rec.treatment}</Text>}

            {rec.prescription && (
              <View style={styles.prescriptionBox}>
                <View style={styles.prescriptionHeader}>
                  <Text style={styles.prescriptionTitle}>💊 Receta Médica:</Text>
                  <Button
                    title="📱 Compartir"
                    onPress={() => sharePrescription(rec)}
                    style={styles.shareButton}
                  />
                </View>
                <Text style={styles.prescriptionText}>{rec.prescription}</Text>
              </View>
            )}

            {rec.vaccinesApplied && rec.vaccinesApplied.length > 0 && (
              <Text style={styles.vaccinesText}>💉 Vacunas: {rec.vaccinesApplied.join(', ')}</Text>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.textSecondary,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  notesText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: theme.colors.textMuted,
    marginTop: 6,
  },
  buttonGroup: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginVertical: theme.spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  weightText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  recordDiagnosis: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  recordDetail: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  prescriptionBox: {
    backgroundColor: theme.colors.inputBackground,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prescriptionTitle: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    fontSize: 13,
  },
  shareButton: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  prescriptionText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    marginTop: 2,
  },
  vaccinesText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 13,
    marginTop: 6,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});
