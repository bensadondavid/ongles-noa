import { useState } from "react"
import { Outlet, Navigate } from "react-router-dom"

function PrivatePage() {

    const urlBack = import.meta.env.VITE_URL_BACK || 'http://localhost:3000'
   const token
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(null)

  return (
    isLoggedIn ? <Outlet /> : <Navigate to='/login' />
  )

}

export default PrivatePage