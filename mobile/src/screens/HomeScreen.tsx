import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { theme } from '../theme';

export interface HomeScreenProps {
  readonly navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [petsCount, setPetsCount] = useState(0);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setRefreshing(true);
      const [petsData, appointmentsData] = await Promise.all([
        api.get('/pet').catch(() => []),
        api.get('/appointment').catch(() => []),
      ]);

      setPetsCount(Array.isArray(petsData) ? petsData.length : 0);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData.slice(0, 3) : []);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor={theme.colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Hola, {user?.fullName || user?.username}! 👋</Text>
        <Text style={styles.roleText}>Panel Móvil — Rol: {user?.roles?.join(', ')}</Text>
      </View>

      {/* Grid de Resumen */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard} borderLeftColor={theme.colors.primary}>
          <Text style={styles.statLabel}>🐾 Mascotas</Text>
          <Text style={styles.statValue}>{petsCount}</Text>
        </Card>

        <Card style={styles.statCard} borderLeftColor={theme.colors.secondary}>
          <Text style={styles.statLabel}>📅 Próx. Citas</Text>
          <Text style={styles.statValue}>{appointments.length}</Text>
        </Card>
      </View>

      {/* Acceso Rápido */}
      <Card style={styles.actionCard}>
        <Text style={styles.sectionTitle}>🚀 Acciones Rápidas</Text>
        <Button
          title="🐾 Mis Mascotas / Ver Fichas"
          onPress={() => navigation.navigate('Pets')}
        />
        <Button
          title="📅 Solicitar / Reservar Turno"
          onPress={() => navigation.navigate('BookAppointment')}
          variant="secondary"
        />
        <Button
          title="📋 Ver Historial de Turnos"
          onPress={() => navigation.navigate('Appointments')}
          variant="outline"
        />
      </Card>

      {/* Próximos Turnos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Citas Agendadas Recientes</Text>
        {appointments.length === 0 ? (
          <Text style={styles.emptyText}>No tienes turnos pendientes en este momento.</Text>
        ) : (
          appointments.map(item => (
            <Card key={item.uuid}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text>
                <StatusBadge status={item.status} />
              </View>
              {item.reason && <Text style={styles.reasonText}>Motivo: {item.reason}</Text>}
            </Card>
          ))
        )}
      </View>
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
  header: {
    marginBottom: theme.spacing.md,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  roleText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
  actionCard: {
    marginVertical: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  reasonText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});
