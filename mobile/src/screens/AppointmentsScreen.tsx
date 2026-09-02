import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { theme } from '../theme';

export interface AppointmentsScreenProps {
  readonly navigation: any;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const isStaff = user?.roles?.some(r => ['admin', 'vet'].includes(r));

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setRefreshing(true);
      const res = await api.get('/appointment');
      setAppointments(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleCancel(uuid: string) {
    Alert.alert('Confirmar', '¿Deseas cancelar esta cita?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, Cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.patch(`/appointment/${uuid}`, { status: 'cancelled' });
            loadAppointments();
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  }

  async function handleConfirm(uuid: string) {
    try {
      await api.patch(`/appointment/${uuid}`, { status: 'confirmed' });
      loadAppointments();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }

  const renderAppointmentItem = ({ item }: { item: any }) => (
    <Card borderLeftColor={theme.colors.secondary}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text>
        <StatusBadge status={item.status} />
      </View>

      {item.reason && <Text style={styles.reasonText}>Motivo: {item.reason}</Text>}

      <View style={styles.actionRow}>
        {isStaff && item.status === 'pending' && (
          <Button
            title="Confirmar"
            onPress={() => handleConfirm(item.uuid)}
            style={styles.smallButton}
          />
        )}
        {item.status !== 'completed' && item.status !== 'cancelled' && (
          <Button
            title="Cancelar"
            onPress={() => handleCancel(item.uuid)}
            variant="danger"
            style={styles.smallButton}
          />
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={item => item.uuid}
        renderItem={renderAppointmentItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAppointments} tintColor={theme.colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Agenda de Turnos</Text>
            <Button
              title="+ Reservar Nuevo Turno"
              onPress={() => navigation.navigate('BookAppointment')}
            />
          </View>
        }
        ListEmptyComponent={
          !refreshing ? (
            <Text style={styles.emptyText}>No hay turnos registrados.</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  reasonText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  emptyText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
