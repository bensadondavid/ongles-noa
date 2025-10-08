import { useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from "../Store/UsersSlice";
import { Link, useNavigate } from "react-router-dom";

interface FormData{
  mailOrPhone : string,
  password : string
}

function Login() {

  const languageState = useSelector(state => state.language)
  const urlBack = import.meta.env.VITE_URL_BACK || "http://localhost:3000"
  const [message, setMessage] = useState<string>('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    mailOrPhone : '',
    password : ''
  })

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target
    setFormData(
      prev => ({...prev, [name] : value})
    )
  }
  
  const handleSubmit = async(e : React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try{
      const response = await fetch(`${urlBack}/users/login`, {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        credentials: 'include', 
        body : JSON.stringify(formData)
      })
      const data = await response.json()
      if(!response.ok){
        return setMessage(data.message)
      }
      dispatch(addUser({id : data.user.id, name : data.user.name, email : data.user.email}))
      localStorage.setItem('access-token', data.accessToken)
      navigate('/')
    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <div className="login">
       <img src="first-img-ongle.png" className="img-entry-1"/>
        <img src="scnd-img-ongle.png" className="img-entry-2"/>
        <img src="third-img-ongle.png" className="img-entry-3"/>
        <Link to='/' className="back">Back</Link>
        <h1>{languageState === 'french' ? 'Se connecter' : languageState === 'hebrew' ? 'להתחבר' : null}</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="mailOrPhone" value={formData.mailOrPhone} onChange={handleChange} autoComplete='email'
          placeholder={languageState === 'french' ? 'E-mail ou Téléphone' : languageState === 'hebrew' ? 'מייל ו טל' : ''}
          />
          <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="password" 
           placeholder={languageState === 'french' ? 'Mot de passe' : languageState === 'hebrew' ? 'סיסמה' : ''}
          />
          <button type="submit">{languageState === 'french' ? 'Se connecter' : languageState === 'hebrew' ? 'להתחבר' : ""}</button>
        </form>
        <p className="mdp-oublie">{languageState === 'french' ? 'Mot de passe oublié ?' : languageState === 'hebrew' ? '? שבחת סיסה' : ""}</p>
        {message && <p className="login-message">{message}</p> }
    </div>
  )

}

export default Login