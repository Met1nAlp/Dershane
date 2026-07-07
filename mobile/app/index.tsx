import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export default function Index() {
  const { isAuthenticated, user, loadFromStorage } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    loadFromStorage().finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Role göre yönlendir
  switch (user.rol) {
    case 'ADMIN':    return <Redirect href="/(admin)" />;
    case 'OGRETMEN': return <Redirect href="/(teacher)" />;
    case 'OGRENCI':  return <Redirect href="/(student)" />;
    case 'VELI':     return <Redirect href="/(parent)" />;
    default:         return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
});
