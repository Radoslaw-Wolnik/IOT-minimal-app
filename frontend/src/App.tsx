import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TableViewPage from './pages/TableViewPage';
import TableEditPage from './pages/TableEditPage';
import DeviceTestPage from './pages/DeviceTestPage';
import DeviceCreatePage from './pages/DeviceCreatePage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import DataEntryPage from './pages/DataEntryPage';
import BackupManagementPage from './pages/BackupManagementPage';
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
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/table/:id" element={<TableViewPage />} />
                  <Route path="/table/:id/edit" element={<TableEditPage />} />
                  <Route path="/table/:id/data-entry" element={<DataEntryPage />} />
                  <Route path="/device-test" element={<DeviceTestPage />} />
                  <Route path="/device/create" element={<DeviceCreatePage />} />
                  <Route path="/device/:id" element={<DeviceDetailPage />} />
                  <Route path="/backups" element={<BackupManagementPage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;