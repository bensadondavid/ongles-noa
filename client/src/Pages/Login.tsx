import { useState } from "react"
import { useDispatch } from 'react-redux';
import { addUser } from "../Store/userSlice";
import { useNavigate } from "react-router-dom";

interface FormData{
  email : string,
  password : string
}

function Login() {

  const urlBack = import.meta.env.VITE_URL_BACK
  const [message, setMessage] = useState<string>('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    email : '',
    password : ''
  })
  
  const handleSubmit = async()=>{
    try{
      const response = await fetch(`${urlBack}/users/login`, {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData)
      })
      const data = await response.json()
      if(!response.ok){
        return setMessage(data.message)
      }
      dispatch(addUser({id : data.user.id, email : data.user.email, accessToken : data.accessToken }))
      navigate('/prestations')
    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <div className="login">
        <form onSubmit={handleSubmit}>
          
        </form>
    </div>
  )

}

export default Login