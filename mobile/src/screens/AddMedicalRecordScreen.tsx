import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme';

export interface AddMedicalRecordScreenProps {
  readonly route: any;
  readonly navigation: any;
}

export const AddMedicalRecordScreen: React.FC<AddMedicalRecordScreenProps> = ({ route, navigation }) => {
  const { petUuid } = route.params;

  const [reason, setReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');
  const [weight, setWeight] = useState('');
  const [vaccinesText, setVaccinesText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!diagnosis) {
      Alert.alert('Atención', 'Ingrese el diagnóstico médico.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/medical-record', {
        petUuid,
        reason,
        diagnosis,
        treatment,
        prescription,
        weight: weight ? parseFloat(weight) : undefined,
        vaccinesApplied: vaccinesText ? vaccinesText.split(',').map(v => v.trim()) : [],
      });

      Alert.alert('Éxito', 'Atención médica e historia clínica guardadas.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar la ficha médica.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💉 Cargar Consulta Médica</Text>

      <Input
        label="Motivo de la Consulta"
        value={reason}
        onChangeText={setReason}
      />

      <Input
        label="Diagnóstico Médico *"
        value={diagnosis}
        onChangeText={setDiagnosis}
      />

      <Input
        label="Tratamiento Realizado"
        value={treatment}
        onChangeText={setTreatment}
      />

      <Input
        label="💊 Receta Médica / Prescripción"
        multiline
        numberOfLines={3}
        value={prescription}
        onChangeText={setPrescription}
      />

      <Input
        label="Peso (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Input
        label="Vacunas Aplicadas (separadas por coma)"
        placeholder="Ej: Antirrábica, Quintuple"
        value={vaccinesText}
        onChangeText={setVaccinesText}
      />

      <Button
        title={loading ? 'Guardando...' : 'Guardar Consulta'}
        onPress={handleSave}
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
});
