import '../global.css';
import { AuthProvider } from '@/context/AuthContext';
import RootNavigator from '@/components/RootNavigator';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
