import { useState } from "react";
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Store/Store";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface LanguageHeader {
  french: string;
  hebrew: string;
}

function Creneaux() {

  const dispatch = useDispatch()
  const languageState = useSelector((state : RootState) => state.language)

  const [selected, setSelected] = useState<Date>();

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
    </div>
  )

}

export default Creneaux