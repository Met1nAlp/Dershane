import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout() {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isLoading || !isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Role bazlı yönlendirme
      const role = user?.rol;
      switch (role) {
        case 'ADMIN':    router.replace('/(admin)'); break;
        case 'OGRETMEN': router.replace('/(teacher)'); break;
        case 'OGRENCI':  router.replace('/(student)'); break;
        case 'VELI':     router.replace('/(parent)'); break;
        default:         router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading, user, segments, isReady]);

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}
