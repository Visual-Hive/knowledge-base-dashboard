import SettingsPage from '../../pages/SettingsPage';
import { AuthProvider } from '@/contexts/AuthContext';

export default function SettingsPageExample() {
  return (
    <AuthProvider>
      <SettingsPage />
    </AuthProvider>
  );
}
