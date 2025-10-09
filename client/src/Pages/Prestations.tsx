import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { addPrestation, deletePrestation } from "../Store/PrestationSlice"
import type { RootState } from "../Store/Store";

function Prestations() {

  const dispatch = useDispatch()
  const prestationState = useSelector((state : RootState)=> state.prestations)
  const languageState = useSelector((state : RootState) => state.language)
  const language = [
    {french : 'Prestations', hebrew : 'טיפול'},
    {french : 'liste', hebrew : "רשימה"},
    {french : 'Manucure et soins des ongles', hebrew : "מניקור וטיפוח הציפורניים"}
  ]

  const addToPrestations = (type : string)=>{
   if (prestationState.includes(type)) {
    dispatch(deletePrestation(type))
  } else {
    dispatch(addPrestation(type))
  }
  }

  return (
    <div className="prestations">
      <p className="prestations-title">{languageState === 'french' ? language[0].french : languageState === "hebrew" ? language[0].hebrew : ""}</p>
      <p className="prestations-subtitle">{languageState === 'french' ? language[1].french : languageState === "hebrew" ? language[1].hebrew : ""}</p>

      <div className="prestations-list">
        <button className={prestationState.includes('manucure-soins-ongles') ? 'prestation-button-active' : "prestation-button"} onClick={()=>addToPrestations("manucure-soins-ongles")} >{languageState === 'french' ? language[2].french : languageState === "hebrew" ? language[2].hebrew : ""}</button>
      </div>
    </div>
  )

}

export default Prestations