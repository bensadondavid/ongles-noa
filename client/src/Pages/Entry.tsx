import EmojiGoogle from "../assets/svg/EmojiGoogle"

function Entry() {

  return (
    <div className="entry">
      <img src="first-img-ongle.png" className="img-entry-1"/>
      <img src="scnd-img-ongle.png" className="img-entry-2"/>
      <img src="third-img-ongle.png" className="img-entry-3"/>

    <div className="entry-languages">
      <button><span className="flag">🇫🇷</span></button>
      <button><span className="flag">🇮🇱</span></button>
    </div>

    <div className="entry-names">
      <p className="entry-noa">Noa</p>
      <p className="entry-bensadon">Bensadon</p>
    </div>
    <div className="entry-connections">
      <button>Se connecter</button>
      <button>Se connecter avec Google <EmojiGoogle /> </button>
      <button>S'inscrire</button>
    </div>

    <div className="entry-social-networks">
      <a href=""><img src="insta.png" /></a>
      <a href=""><img src="whatsapp.png" /></a>
    </div>

    </div>
  )

}

export default Entry