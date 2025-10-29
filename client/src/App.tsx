import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import KnowledgeBasesPage from "@/pages/KnowledgeBasesPage";
import DocumentsPage from "@/pages/DocumentsPage";
import SearchPage from "@/pages/SearchPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";

function LoginRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  
  return <LoginPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <LoginRedirect />
      </Route>
      <Route path="/">
        <ProtectedRoute>
          <AppLayout>
            <KnowledgeBasesPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/kb/:id/documents">
        <ProtectedRoute>
          <AppLayout>
            <DocumentsPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/search">
        <ProtectedRoute>
          <AppLayout>
            <SearchPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
