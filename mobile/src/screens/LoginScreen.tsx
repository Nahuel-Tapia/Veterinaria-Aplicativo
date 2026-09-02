import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';

export interface LoginScreenProps {
  readonly navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert('Atención', 'Ingrese usuario y contraseña.');
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
    } catch (err: any) {
      Alert.alert('Error al Ingresar', err.message || 'Credenciales incorrectas.');
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
        <View style={styles.header}>
          <Text style={styles.logoText}>🐾 VetCare Pro</Text>
          <Text style={styles.subTitle}>Inicia sesión en tu cuenta móvil</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre de Usuario"
            placeholder="Ej: juanperez"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title={loading ? 'Ingresando...' : 'Iniciar Sesión'}
            onPress={handleLogin}
            disabled={loading}
          />

          <Button
            title="¿No tienes cuenta? Regístrate aquí"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={{ marginTop: theme.spacing.sm }}
          />
        </View>
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
    flexGrow: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  subTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  form: {
    width: '100%',
  },
});
