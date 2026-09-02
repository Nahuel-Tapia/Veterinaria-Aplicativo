import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';

export interface ButtonProps {
  readonly title: string;
  readonly onPress: () => void;
  readonly variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  readonly disabled?: boolean;
  readonly style?: ViewStyle;
  readonly textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.textMuted;
    switch (variant) {
      case 'secondary': return theme.colors.secondary;
      case 'danger': return theme.colors.danger;
      case 'outline': return 'transparent';
      default: return theme.colors.primary;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outlineBorder,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'outline' && { color: theme.colors.primary },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md - 2,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.xs,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
