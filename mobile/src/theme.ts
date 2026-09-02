export const theme = {
  colors: {
    primary: '#4caf50',
    primaryDark: '#2e7d32',
    secondary: '#2196f3',
    accent: '#ff9800',
    danger: '#e53935',
    background: '#121212',
    cardBackground: '#1e1e1e',
    cardBorder: '#333333',
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
    textMuted: '#757575',
    inputBackground: '#2a2a2a',
    inputBorder: '#444444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    round: 9999,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: '#ffffff',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#4caf50',
    },
    body: {
      fontSize: 14,
      color: '#e0e0e0',
    },
    caption: {
      fontSize: 12,
      color: '#b0b0b0',
    },
  },
};

export type Theme = typeof theme;
