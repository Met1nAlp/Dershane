import React, { memo } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize } from '../constants/theme';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Yükleniyor...',
  size = 'large',
  color = Colors.accent,
}) => {
  return (
    <View style={styles.container} accessibilityLabel={message}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default memo(LoadingState);