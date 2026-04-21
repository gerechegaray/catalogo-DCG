import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLogin from './AdminLogin'

const VET_CODE = import.meta.env.VITE_VET_ACCESS_CODE
const PET_CODE = import.meta.env.VITE_PET_ACCESS_CODE

const SESSION_KEYS = {
  veterinarios: 'dcg_vet_access',
  petshops: 'dcg_pet_access'
}

const ACCESS_CODES = {
  veterinarios: VET_CODE,
  petshops: PET_CODE
}

const ProtectedRoute = ({ children, requireAdmin = false, section = null }) => {
  const { isAdmin } = useAuth()
  const location = useLocation()

  if (requireAdmin && !isAdmin) {
    return <AdminLogin />
  }

  if (section) {
    const sessionKey = SESSION_KEYS[section]
    const validCode = ACCESS_CODES[section]

    const params = new URLSearchParams(location.search)
    const urlCode = params.get('c')

    if (urlCode && urlCode === validCode) {
      localStorage.setItem(sessionKey, 'true')
    }

    const hasAccess = localStorage.getItem(sessionKey) === 'true'

    if (!hasAccess) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
