import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toast';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppShell } from '@/components/layout/app-shell';
import Home from '@/pages/home';
import Dashboard from '@/pages/dashboard';
import Investigations from '@/pages/investigations';
import InvestigationRoom from '@/pages/investigation-room';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-mono font-bold text-destructive mb-2">404</h1>
      <p className="text-muted-foreground font-mono">SECTOR_NOT_FOUND</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/investigations" component={Investigations} />
      <Route path="/investigations/:id" component={InvestigationRoom} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppShell>
          <Router />
        </AppShell>
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
