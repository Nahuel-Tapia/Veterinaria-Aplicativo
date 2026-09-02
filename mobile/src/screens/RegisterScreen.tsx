import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';

export interface RegisterScreenProps {
  readonly navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dni: '',
  });

  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();

  async function handleRegister() {
    if (!formData.username || !formData.password || !formData.fullName || !formData.email) {
      Alert.alert('Atención', 'Complete los campos obligatorios (*).');
      return;
    }

    try {
      setLoading(true);
      await registerUser(formData);
      Alert.alert('Éxito', 'Registro completado con éxito. ¡Ya puedes iniciar sesión!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      Alert.alert('Error en Registro', err.message || 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro de Cliente</Text>
        <Text style={styles.subTitle}>Crea tu cuenta de dueño de mascota</Text>

        <Input
          label="Usuario *"
          value={formData.username}
          onChangeText={txt => setFormData({ ...formData, username: txt })}
          autoCapitalize="none"
        />

        <Input
          label="Contraseña *"
          secureTextEntry
          value={formData.password}
          onChangeText={txt => setFormData({ ...formData, password: txt })}
        />

        <Input
          label="Nombre y Apellido completo *"
          value={formData.fullName}
          onChangeText={txt => setFormData({ ...formData, fullName: txt })}
        />

        <Input
          label="Email *"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={txt => setFormData({ ...formData, email: txt })}
          autoCapitalize="none"
        />

        <Input
          label="Teléfono"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={txt => setFormData({ ...formData, phone: txt })}
        />

        <Input
          label="Dirección"
          value={formData.address}
          onChangeText={txt => setFormData({ ...formData, address: txt })}
        />

        <Button
          title={loading ? 'Registrando...' : 'Crear Cuenta'}
          onPress={handleRegister}
          disabled={loading}
        />

        <Button
          title="Volver a Iniciar Sesión"
          onPress={() => navigation.navigate('Login')}
          variant="outline"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
});
