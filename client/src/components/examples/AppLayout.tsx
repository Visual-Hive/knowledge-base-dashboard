import AppLayout from '../AppLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AppLayoutExample() {
  return (
    <AuthProvider>
      <div style={{ height: '600px' }}>
        <AppLayout>
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Main Content Area</h1>
            <p className="text-muted-foreground">
              This is where the page content will be displayed. The sidebar can be toggled on mobile devices.
            </p>
          </div>
        </AppLayout>
      </div>
    </AuthProvider>
  );
}
