import EmojiGoogle from "../assets/svg/EmojiGoogle"
import { useDispatch, useSelector } from "react-redux"
import { changeLanguage } from '../Store/LanguageSlice'

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
      <button>{languageState === 'french' ? "Se connecter" : languageState === 'hebrew' ? "להתחבר" : null}</button>
      <button>{languageState === 'french' ? (<>Se connecter avec google <EmojiGoogle /></>) : languageState === 'hebrew' ? (<><EmojiGoogle/> Google להתחבר עם</>) : null}</button>
      <button>{languageState === 'french' ? "S'inscrire" : languageState === 'hebrew' ? "להרשם" : null}</button>
    </div>

    <div className="entry-social-networks">
      <a href=""><img src="insta.png" /></a>
      <a href=""><img src="whatsapp.png" /></a>
    </div>

    </div>
  )

}

export default Entry