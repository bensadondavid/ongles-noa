import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Store/Store";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function Creneaux() {

  const urlBack = import.meta.env.URL_BACK || 'http://localhost:3000'
  const dispatch = useDispatch()
  const languageState = useSelector((state : RootState) => state.language)
  const prestations = useSelector((state : RootState) => state.prestations)
  const options = useSelector((state : RootState) => state.options)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [selected, setSelected] = useState<Date>();

  const getAvailability = async ()=>{
    try{
      if (!selected) return 
      const date = selected?.toISOString().split('T')[0]
      console.log(date)
      const response = await fetch(`${urlBack}/bookings/availability`, {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({date ,prestations, options})
      })
      const data = await response.json()
      if(!response.ok){
        return setErrorMessage(data.message)
      }
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getAvailability()
  }, [selected, prestations, options])


  return (
    <div className="crenaux">
      <p className="crenaux-title">{languageState === 'french' ? 'Crénaux' : languageState === "hebrew" ? 'מועדים' : ""}</p>
      <p className="crenaux-subtitle">{languageState === 'french' ? 'Dispos' : languageState === "hebrew" ? 'פנויים' : ""}</p>
      <div className="calendar">
         <DayPicker
            animate
            mode="single"
            selected={selected}
            onSelect={setSelected}
            navLayout="around"
          />
      </div>
      <div className="horaires">

      </div>
      {errorMessage && <p style={{width : '80%', lineHeight : "25px", fontWeight : "bolder"}}>{errorMessage}</p> }
    </div>
  )

}

export default Creneaux