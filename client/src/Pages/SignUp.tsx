import { useState } from "react"
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";

interface FormData{
  name : string,
  email : string,
  phone : string,
  password : string,
  verifyPassword : string
}

function SignUp() {

  const languageState = useSelector(state => state.language)
  const urlBack = import.meta.env.VITE_URL_BACK || "http://localhost:3000"
  const [message, setMessage] = useState<string>('')
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    name : '',
    email : '',
    phone : '',
    password : '',
    verifyPassword : ''
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
      if(formData.password !== formData.verifyPassword){
        return setMessage(languageState === 'french' ? 'Les mots de passe ne correspondent pas' : languageState === 'hebrew' ? 'הסיסמאות לא תואמות' : '')
      }
      if(formData.password.length < 8){
        return setMessage(languageState === 'french' ? 'Le mot de passe doit contenir au mois 8 caractères' : languageState === 'hebrew' ? 'הסיסמה חייבת להיות באורך של לפחות 8 תווים' : '')
      }
      const body = { name : formData.name, email : formData.email, phone : formData.phone, password : formData.password }
      const response = await fetch(`${urlBack}/users/sign-up`, {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(body)
      })
      const data = await response.json()
      if(!response.ok){
        return setMessage(data.message)
      }
      navigate('/login')
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
        <h1>{languageState === 'french' ? "S'inscrire" : languageState === 'hebrew' ? 'להרשם' : null}</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
          placeholder={languageState === 'french' ? 'Prénom' : languageState === 'hebrew' ? 'שם' : ''}
          />
          <input type="text" name="email" value={formData.email} onChange={handleChange} autoComplete='email'
          placeholder={languageState === 'french' ? 'E-mail' : languageState === 'hebrew' ? 'מייל' : ''}
          />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete='tel'
          placeholder={languageState === 'french' ? 'Téléphone' : languageState === 'hebrew' ? 'טלפון' : ''}
          />
          <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="current-password" 
           placeholder={languageState === 'french' ? 'Mot de passe' : languageState === 'hebrew' ? 'סיסמה' : ''}
          />
           <input type="password" name="verifyPassword" value={formData.verifyPassword} onChange={handleChange} 
           placeholder={languageState === 'french' ? 'Confirmation Mot de passe' : languageState === 'hebrew' ? 'אימות סיסמה' : ''}
          />
          <button type="submit">{languageState === 'french' ? "S'inscrire" : languageState === 'hebrew' ? 'להרשם' : null}</button>
        </form>
        {message && <p style={{width : '80%', lineHeight : "25px", fontWeight : "bolder"}} className="login-message">{message}</p> }
    </div>
  )

}

export default SignUp