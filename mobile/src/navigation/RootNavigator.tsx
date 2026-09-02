import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PetsScreen } from '../screens/PetsScreen';
import { PetDetailScreen } from '../screens/PetDetailScreen';
import { AddPetScreen } from '../screens/AddPetScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { BookAppointmentScreen } from '../screens/BookAppointmentScreen';
import { AddMedicalRecordScreen } from '../screens/AddMedicalRecordScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.cardBackground },
        headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: theme.colors.cardBackground, borderTopColor: theme.colors.cardBorder },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIcon: ({ color }) => {
          let icon = '🏠';
          if (route.name === 'HomeTab') icon = '🏠';
          else if (route.name === 'PetsTab') icon = '🐾';
          else if (route.name === 'AppointmentsTab') icon = '📅';
          else if (route.name === 'ServicesTab') icon = '🛠️';
          else if (route.name === 'ProfileTab') icon = '👤';
          return <Text style={{ fontSize: 18 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="PetsTab" component={PetsScreen} options={{ title: 'Mascotas' }} />
      <Tab.Screen name="AppointmentsTab" component={AppointmentsScreen} options={{ title: 'Turnos' }} />
      <Tab.Screen name="ServicesTab" component={ServicesScreen} options={{ title: 'Servicios' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="PetDetail" component={PetDetailScreen} options={{ headerShown: true, title: 'Ficha de Mascota', headerStyle: { backgroundColor: theme.colors.cardBackground }, headerTintColor: '#fff' }} />
          <Stack.Screen name="AddPet" component={AddPetScreen} options={{ headerShown: true, title: 'Registrar Mascota', headerStyle: { backgroundColor: theme.colors.cardBackground }, headerTintColor: '#fff' }} />
          <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ headerShown: true, title: 'Reservar Cita', headerStyle: { backgroundColor: theme.colors.cardBackground }, headerTintColor: '#fff' }} />
          <Stack.Screen name="AddMedicalRecord" component={AddMedicalRecordScreen} options={{ headerShown: true, title: 'Cargar Consulta Médica', headerStyle: { backgroundColor: theme.colors.cardBackground }, headerTintColor: '#fff' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
