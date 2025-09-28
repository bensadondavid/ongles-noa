import { useEffect, useState } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { tailspin } from 'ldrs'

tailspin.register()

function PrivatePage() {

    const urlBack = import.meta.env.VITE_URL_BACK || 'http://localhost:3000'

    const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null)

    const verifyToken = async()=>{
      try{
        const response = await fetch(`${urlBack}/verify`, {
          method : 'GET',
          credentials : 'include'
        })
        const data = await response.json()
        if(!response.ok){
          console.log(data.message);
         return setIsLoggedIn(false)
        }
        setIsLoggedIn(true)
      }
      catch(error){
        console.log(error);
        setIsLoggedIn(false)
      }
    }

    useEffect(()=>{
      verifyToken()
    },[])

    if (isLoggedIn === null) {
      return <div className="private-charging"><l-tailspin size="20" stroke="5" speed="0.9" color="#857667" ></l-tailspin></div>
    }
    return (
      isLoggedIn ? <Outlet /> : <Navigate to='/users/login' replace />
    )

}

export default PrivatePage