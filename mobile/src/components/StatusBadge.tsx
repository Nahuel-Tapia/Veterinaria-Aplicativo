import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export interface StatusBadgeProps {
  readonly status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmado', bg: '#2e7d32' };
      case 'pending':
        return { label: 'Pendiente', bg: '#ef6c00' };
      case 'in_progress':
        return { label: 'En Atención', bg: '#0288d1' };
      case 'completed':
        return { label: 'Completado', bg: '#388e3c' };
      case 'cancelled':
        return { label: 'Cancelado', bg: '#d32f2f' };
      default:
        return { label: status, bg: theme.colors.cardBorder };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={styles.text}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.round,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
