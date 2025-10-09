import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "../Store/Store";

function Options() {

  const languageState = useSelector((state : RootState) => state.language)
  const language = [
    {french : 'Options', hebrew : 'תוספות'},
    {french : 'liste', hebrew : "רשימה"}
  ]

  return (
    <div className="options">
      <p className="options-title">{languageState === 'french' ? language[0].french : languageState === "hebrew" ? language[0].hebrew : ""}</p>
      <p className="options-subtitle">{languageState === 'french' ? language[1].french : languageState === "hebrew" ? language[1].hebrew : ""}</p>
    </div>
  )

}

export default Options