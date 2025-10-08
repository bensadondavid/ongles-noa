import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

function Prestations() {

  const languageState = useSelector(state => state.language)
  const language = [
    {french : 'Prestations', hebrew : 'טיפול'},
    {french : 'liste', hebrew : "רשימה"}
  ]

  return (
    <div className="prestations">
      <p className="prestations-title">{languageState === 'french' ? language[0].french : languageState === "hebrew" ? language[0].hebrew : ""}</p>
      <p className="prestations-subtitle">{languageState === 'french' ? language[1].french : languageState === "hebrew" ? language[1].hebrew : ""}</p>
    </div>
  )

}

export default Prestations