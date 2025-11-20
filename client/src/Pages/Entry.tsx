import { useDispatch, useSelector } from "react-redux"
import { changeLanguage } from '../Store/LanguageSlice'
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { addUser, clearUser } from "../Store/UsersSlice"
import type { RootState } from "../Store/Store";

function Entry() {

  const languageState = useSelector((state : RootState) => state.language)
  const userState = useSelector((state : RootState) => state.user)
  const dispatch = useDispatch()
  const urlBack = import.meta.env.VITE_URL_BACK || 'http://localhost:3000'
  const [connected, setConnected] = useState<boolean>(false)
  const navigate = useNavigate()

  const verifyConnected = async()=>{
    try{
      // Verifyng if the access token exists and works
        const token = localStorage.getItem('access-token')
        if(token){
            const verif = await fetch(`${urlBack}/users/me`, {
              method : 'GET',
              headers : {'Authorization' : `Bearer ${token}`}
          })
          if(verif.ok){
            const res = await verif.json()
            dispatch(addUser({id : res.user.id, name : res.user.name, lastName : res.user.lastName, email : res.user.email }))
            return setConnected(true)
          }
        }
        // if no token or invalid token, go to refresh token
        const response = await fetch(`${urlBack}/users/refresh`, {
          method : 'POST', 
          credentials : 'include'
        })
        if(!response.ok){
          setConnected(false)
          navigate('/login')
          return
        }
        const data = await response.json()
        localStorage.setItem('access-token', data.accessToken)
        dispatch(addUser({id : data.user.id, name : data.user.name, lastName : data.user.lastName, email : data.user.email }))
        setConnected(true)
      }
    catch(error){
      console.log(error)
      setConnected(false)
      navigate('/login')
    }
  }

  const logOut = async()=>{
    try{
      const response = await fetch(`${urlBack}/users/log-out`, {
        method : 'POST', 
        credentials : 'include',
      })
      const data = await response.json()
      if(!response.ok){
        return console.log(data.message)
      }
      dispatch(clearUser())
      localStorage.removeItem('access-token')
      setConnected(false)
      return
    }
    catch(error){
      console.log(error)
    }
  }


  return (
    <div className="entry">
      <img src="first-img-ongle.png" className="img-entry-1"/>
      <img src="scnd-img-ongle.png" className="img-entry-2"/>
      <img src="third-img-ongle.png" className="img-entry-3"/>
      
      <div className="entry-languages">
        <button onClick={()=>dispatch(changeLanguage('french'))}><span className="flag">🇫🇷</span></button>
        <button onClick={()=>dispatch(changeLanguage('hebrew'))}><span className="flag">🇮🇱</span></button>
      </div>

    <div className="entry-names">
      <p className="entry-noa">Noa</p>
      <p className="entry-bensadon">Bensadon</p>
    </div>
    {connected ?
    <div className="connected">
      <p>{languageState === 'french' ? `Bonjour ${userState?.name} ${userState?.lastName}` : languageState === 'hebrew' ? `${userState?.name} שלום` : ''}</p>
      <Link to='/prestations' className="prendre-rdv">{languageState === 'french' ? "Prendre RDV" : languageState === 'hebrew' ? "לקבוע תור" : ''}</Link>
      <button onClick={logOut} className="log-out">{languageState === 'french' ? "Se deconnecter" : languageState === 'hebrew' ? "להתנתק" : null}</button>
    </div>
    :
    <div className="entry-connections">
      <button onClick={verifyConnected}>{languageState === 'french' ? "Se connecter" : languageState === 'hebrew' ? "להתחבר" : ''}</button>
      <Link to='/sign-up'>{languageState === 'french' ? "S'inscrire" : languageState === 'hebrew' ? "להרשם" : ''}</Link>
      <Link to='/galery'>{languageState === 'french' ? "Galerie" : languageState === 'hebrew' ? "גלריה" : ''}</Link>
    </div>
    }

    <div className="entry-social-networks">
      <a href=""><img src="insta.png" /></a>
      <a href=""><img src="whatsapp.png" /></a>
    </div>

  </div>
  )

}

export default Entry