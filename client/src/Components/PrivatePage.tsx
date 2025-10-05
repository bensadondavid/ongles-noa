import { useEffect, useState } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { tailspin } from 'ldrs'
import { useDispatch } from "react-redux"
import { addUser } from "../Store/userSlice"

tailspin.register()

function PrivatePage() {

    const urlBack = import.meta.env.VITE_URL_BACK || 'http://localhost:3000'
    const dispatch = useDispatch()
    const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null)

    const verifyToken = async()=>{
      try{
        const token = localStorage.getItem('access-token')
        if(token){
            const verify = await fetch(`${urlBack}/users/me`, {
            method : 'GET',
            headers : {
              'Authorization' : `Bearer ${token}`
            }})
            if(verify.ok){
              const data = await verify.json()
              dispatch(addUser({id : data.user.id, name : data.user.name, lastName : data.user.lastName, email : data.user.email }))
              setIsLoggedIn(true)
              return
            }
        }
        const response = await fetch(`${urlBack}/users/refresh`, {
          method : 'POST',
          credentials : 'include'
        })
        const data = await response.json()
        if(!response.ok){
          console.log(data.message);
          return setIsLoggedIn(false)
        }
        localStorage.setItem('access-token', data.accessToken)
        dispatch(addUser({id : data.user.id, name : data.user.name, email : data.user.email }))
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
      isLoggedIn ? <Outlet /> : <Navigate to='/login' replace />
    )

}

export default PrivatePage