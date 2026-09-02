import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable, TextInput } from 'react-native';
import { api } from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';

export interface PetsScreenProps {
  readonly navigation: any;
}

export const PetsScreen: React.FC<PetsScreenProps> = ({ navigation }) => {
  const [pets, setPets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    try {
      setRefreshing(true);
      const res = await api.get('/pet');
      setPets(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  const filteredPets = pets.filter(p => {
    const q = searchQuery.toLowerCase();
    return !q || p.name?.toLowerCase().includes(q) || p.species?.toLowerCase().includes(q) || p.breed?.toLowerCase().includes(q);
  });

  const renderPetItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => navigation.navigate('PetDetail', { petUuid: item.uuid })}>
      <Card borderLeftColor={theme.colors.primary}>
        <View style={styles.cardHeader}>
          <Text style={styles.petName}>🐾 {item.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{item.species}</Text>
          </View>
        </View>

        <Text style={styles.detailText}>Raza: {item.breed || 'Sin especificar'}</Text>
        <Text style={styles.detailText}>
          Género: {item.gender || '-'} | Peso: {item.weight ? `${item.weight} kg` : '-'}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.linkText}>📋 Ver Historia Clínica →</Text>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPets}
        keyExtractor={item => item.uuid}
        renderItem={renderPetItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadPets} tintColor={theme.colors.primary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Mis Mascotas / Pacientes</Text>

            <TextInput
              style={styles.searchBar}
              placeholder="🔍 Buscar por nombre, especie o raza..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <Button
              title="+ Registrar Mascota"
              onPress={() => navigation.navigate('AddPet')}
            />
          </View>
        }
        ListEmptyComponent={
          !refreshing ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron mascotas.</Text>
            </View>
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
  searchBar: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.inputBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontSize: 14,
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  speciesBadge: {
    backgroundColor: theme.colors.inputBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  speciesText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  detailText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  cardFooter: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  linkText: {
    color: theme.colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
});
