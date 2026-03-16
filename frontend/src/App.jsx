import { Routes, Route } from 'react-router-dom'
import Login from './COMPONENTS/auth/Login'
import Layout from './COMPONENTS/layout/Layout'
import ProtectedRoute from './COMPONENTS/layout/ProtectedRoute'
import Dashboard from './COMPONENTS/dashboard/Dashboard'
import ManagerDashboard from './COMPONENTS/manager/ManagerDashboard'
import SeniorManagerDashboard from './COMPONENTS/senior-manager/SeniorManagerDashboard'
import ComplianceDashboard from './COMPONENTS/compliance/ComplianceDashboard'
import NewTransaction from './COMPONENTS/dashboard/NewTransaction'
import Transactions from './COMPONENTS/dashboard/Transactions'
import ChangePassword from './COMPONENTS/auth/ChangePassword'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/manager" element={
        <ProtectedRoute allowedRoles={["MANAGER"]}>
          <Layout><ManagerDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/senior-manager" element={
        <ProtectedRoute allowedRoles={["SENIOR_MANAGER"]}>
          <Layout><SeniorManagerDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/compliance" element={
        <ProtectedRoute allowedRoles={["COMPLIANCE_OFFICER"]}>
          <Layout><ComplianceDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/new" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <Layout><NewTransaction /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/transactions" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <Layout><Transactions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/change-password" element={
        <ProtectedRoute allowedRoles={["USER","MANAGER","SENIOR_MANAGER","COMPLIANCE_OFFICER","ADMIN"]}>
          <Layout><ChangePassword /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}