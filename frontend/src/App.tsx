import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TableViewPage from './pages/TableViewPage';
import DeviceTestPage from './pages/DeviceTestPage';
import Navbar from './components/Navbar';
import { useTheme } from './hooks/useTheme';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${theme}`}>
            <Navbar />
            <main className="container mx-auto mt-4 p-4">
              <Switch>
                <Route exact path="/login" component={LoginPage} />
                <PrivateRoute exact path="/" component={DashboardPage} />
                <PrivateRoute exact path="/table/:id" component={TableViewPage} />
                <PrivateRoute exact path="/device-test" component={DeviceTestPage} />
              </Switch>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;