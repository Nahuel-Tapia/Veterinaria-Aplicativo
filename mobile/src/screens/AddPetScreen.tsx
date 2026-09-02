import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../theme';

export interface AddPetScreenProps {
  readonly navigation: any;
}

export const AddPetScreen: React.FC<AddPetScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('perro');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('macho');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name) {
      Alert.alert('Atención', 'Ingrese el nombre de la mascota.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/pet', {
        name,
        species,
        breed,
        gender,
        weight: weight ? parseFloat(weight) : undefined,
        notes,
      });
      Alert.alert('Éxito', 'Mascota registrada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar la mascota.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrar Mascota</Text>

      <Input
        label="Nombre de la Mascota *"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Especie (ej: perro, gato, ave, exotico)"
        value={species}
        onChangeText={setSpecies}
      />

      <Input
        label="Raza"
        value={breed}
        onChangeText={setBreed}
      />

      <Input
        label="Género (macho / hembra)"
        value={gender}
        onChangeText={setGender}
      />

      <Input
        label="Peso (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Input
        label="Notas u Observaciones"
        value={notes}
        onChangeText={setNotes}
      />

      <Button
        title={loading ? 'Guardando...' : 'Guardar Mascota'}
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
