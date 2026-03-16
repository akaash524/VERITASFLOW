import { Navigate } from 'react-router-dom'
import useAuthStore from '../../STORES/authStore'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />
  return children
}