import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { theme } from '../theme';

export interface CardProps {
  readonly children: React.ReactNode;
  readonly style?: ViewStyle;
  readonly borderLeftColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, borderLeftColor }) => {
  return (
    <View
      style={[
        styles.card,
        borderLeftColor ? { borderLeftWidth: 4, borderLeftColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.cardBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
