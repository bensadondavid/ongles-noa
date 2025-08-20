import { useDispatch, useSelector } from "react-redux"
import { changeLanguage } from '../Store/LanguageSlice'
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"

function Entry() {

  const languageState = useSelector(state => state.language)
  const dispatch = useDispatch()

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
    <div className="entry-connections">
      <Link to='login'>{languageState === 'french' ? "Se connecter" : languageState === 'hebrew' ? "להתחבר" : null}</Link>
      <Link to='sign-up'>{languageState === 'french' ? "S'inscrire" : languageState === 'hebrew' ? "להרשם" : null}</Link>
      <Link to='galery'>{languageState === 'french' ? "Galerie" : languageState === 'hebrew' ? "גלריה" : null}</Link>
    </div>

    <div className="entry-social-networks">
      <a href=""><img src="insta.png" /></a>
      <a href=""><img src="whatsapp.png" /></a>
    </div>

    </div>
  )

}

export default Entry