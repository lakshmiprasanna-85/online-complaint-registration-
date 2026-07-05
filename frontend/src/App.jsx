import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetails from './pages/ComplaintDetails';
import FeedbackPage from './pages/FeedbackPage';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['USER']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute roles={['AGENT']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/:complaintId"
          element={
            <ProtectedRoute roles={['USER']}>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
};

export default App;
