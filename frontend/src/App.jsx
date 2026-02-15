import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HrManagementPage from './pages/HrManagementPage';
import AddEditHrPage from './pages/AddEditHrPage';
import ResumePage from './pages/ResumePage';

/**
 * Root application component with route definitions.
 */
export default function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/hr-management" element={
                <ProtectedRoute><HrManagementPage /></ProtectedRoute>
            } />
            <Route path="/hr-management/add" element={
                <ProtectedRoute><AddEditHrPage /></ProtectedRoute>
            } />
            <Route path="/hr-management/edit/:id" element={
                <ProtectedRoute><AddEditHrPage /></ProtectedRoute>
            } />
            <Route path="/resume" element={
                <ProtectedRoute><ResumePage /></ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
