import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme';

export interface BookAppointmentScreenProps {
  readonly route?: any;
  readonly navigation: any;
}

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ route, navigation }) => {
  const initialPetUuid = route?.params?.petUuid || '';

  const [pets, setPets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [selectedPet, setSelectedPet] = useState(initialPetUuid);
  const [selectedService, setSelectedService] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    try {
      const [petsData, servicesData] = await Promise.all([
        api.get('/pet').catch(() => []),
        api.get('/service').catch(() => []),
      ]);
      setPets(Array.isArray(petsData) ? petsData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleBook() {
    if (!selectedPet || !selectedService || !dateTime) {
      Alert.alert('Atención', 'Seleccione mascota, servicio e ingrese fecha y hora.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/appointment', {
        petUuid: selectedPet,
        serviceUuid: selectedService,
        date: dateTime,
        reason,
      });

      Alert.alert('Éxito', 'Turno agendado correctamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Appointments') },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo reservar el turno.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reservar Cita / Turno</Text>

      {/* Selección de Mascota */}
      <Text style={styles.label}>1. Seleccionar Mascota *</Text>
      <View style={styles.optionContainer}>
        {pets.map(p => (
          <Pressable
            key={p.uuid}
            onPress={() => setSelectedPet(p.uuid)}
            style={[
              styles.optionChip,
              selectedPet === p.uuid && styles.optionChipSelected,
            ]}
          >
            <Text style={[styles.optionChipText, selectedPet === p.uuid && styles.optionChipTextSelected]}>
              🐾 {p.name} ({p.species})
            </Text>
          </Pressable>
        ))}
        {pets.length === 0 && <Text style={styles.muted}>Cargando mascotas...</Text>}
      </View>

      {/* Selección de Servicio */}
      <Text style={styles.label}>2. Seleccionar Servicio *</Text>
      <View style={styles.optionContainer}>
        {services.map(s => (
          <Pressable
            key={s.uuid}
            onPress={() => setSelectedService(s.uuid)}
            style={[
              styles.optionChip,
              selectedService === s.uuid && styles.optionChipSelected,
            ]}
          >
            <Text style={[styles.optionChipText, selectedService === s.uuid && styles.optionChipTextSelected]}>
              🛠️ {s.name} — ${s.price} ({s.durationMinutes}m)
            </Text>
          </Pressable>
        ))}
        {services.length === 0 && <Text style={styles.muted}>Cargando servicios...</Text>}
      </View>

      {/* Fecha y Hora */}
      <Text style={styles.label}>3. Fecha y Hora *</Text>
      <Input
        placeholder="YYYY-MM-DD THH:mm (ej: 2026-09-05T14:30)"
        value={dateTime}
        onChangeText={setDateTime}
      />

      <Input
        label="Motivo u Observaciones"
        placeholder="Ej: Control de rutina, tos leve"
        value={reason}
        onChangeText={setReason}
      />

      <Button
        title={loading ? 'Agendando...' : 'Confirmar Turno'}
        onPress={handleBook}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  optionChip: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.inputBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  optionChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionChipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  optionChipTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  muted: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});
