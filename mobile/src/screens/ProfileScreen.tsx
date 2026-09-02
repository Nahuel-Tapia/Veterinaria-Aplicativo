import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';

export interface ProfileScreenProps {
  readonly navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card borderLeftColor={theme.colors.primary}>
        <Text style={styles.name}>👤 {user?.fullName}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>📧 {user?.email}</Text>
        <Text style={styles.role}>Roles: {user?.roles?.join(', ')}</Text>
      </Card>

      <Button
        title="Cerrar Sesión Móvil"
        onPress={logout}
        variant="danger"
        style={{ marginTop: theme.spacing.lg }}
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
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  username: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
