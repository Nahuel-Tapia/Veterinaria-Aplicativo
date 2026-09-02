import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { api } from '../api/client';
import { Card } from '../components/Card';
import { theme } from '../theme';

export interface ServicesScreenProps {
  readonly navigation: any;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = () => {
  const [services, setServices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setRefreshing(true);
      const res = await api.get('/service');
      setServices(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  const renderItem = ({ item }: { item: any }) => (
    <Card borderLeftColor={theme.colors.accent}>
      <View style={styles.headerRow}>
        <Text style={styles.serviceName}>🛠️ {item.name}</Text>
        <Text style={styles.priceText}>${item.price}</Text>
      </View>

      {item.description && <Text style={styles.descText}>{item.description}</Text>}
      <Text style={styles.durationText}>Duración estimada: {item.durationMinutes} minutos</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={item => item.uuid}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadServices} tintColor={theme.colors.primary} />}
        ListHeaderComponent={<Text style={styles.title}>Catálogo de Servicios y Tarifas</Text>}
      />
    </View>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  descText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  durationText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
});
