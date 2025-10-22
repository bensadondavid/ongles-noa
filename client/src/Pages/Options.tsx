import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "../Store/Store";
import { addOption, deleteOption } from "../Store/OptionsSlice";

interface LanguageHeader {
  french: string;
  hebrew: string;
}

interface LanguageItem {
  id: string;
  french: string;
  hebrew: string;
  time : string;
  price : string
}

function Options() {

  const languageState = useSelector((state : RootState) => state.language)
  const optionState = useSelector((state : RootState)=> state.options)
  const dispatch = useDispatch()
  
  const headers: LanguageHeader[] = [
  { french: "Options", hebrew: "תוספות" },
  { french: "liste", hebrew: "רשימה" },
];

  const options: LanguageItem[] = [
    { id: "reparation-ongle-casse", french: "Réparation d’un ongle cassé", hebrew: "תיקון ציפורן שבורה", time : '10mn', price : '10sh' },
    { id: "pose-faux-ongle", french: "Pose d’un faux ongle", hebrew: "הדבקת ציפורן מלאכותית", time : '5mn', price : '10sh' },
    { id: "french", french: "French", hebrew: "פרנץ׳", time : '30mn', price : '20sh' },
    { id: "baby-boomer", french: "Baby boomer", hebrew: "בייבי בומר", time : '30mn', price : '20sh' },
    { id: "effet-chrome", french: "Effet chrome", hebrew: "אפקט כרום", time : '30mn', price : '20sh' },
    { id: "stickers-paillettes-strass", french: "Stickers, paillettes, strass", hebrew: "מדבקות, נצנצים, אבני חן", time : '10mn', price : '10sh' },
    { id: "nail-art-simple", french: "Nail art simple par ongle", hebrew: "עיצוב ציפורן פשוט", time : '10mn', price : '10sh' },
    { id: "nail-art-elabore", french: "Nail art élaboré par ongle", hebrew: "עיצוב ציפורן מורכב", time : '30mn', price : '20sh' },
  ];

  const addToOptions = (id : string)=>{
     if (optionState.includes(id)) {
      dispatch(deleteOption(id))
    } else {
      dispatch(addOption(id))
    }
    }

  return (
    <div className="options">
      <p className="options-title">{languageState === 'french' ? headers[0].french : languageState === "hebrew" ? headers[0].hebrew : ""}</p>
      <p className="options-subtitle">{languageState === 'french' ? headers[1].french : languageState === "hebrew" ? headers[1].hebrew : ""}</p>

      <div className="options-list">
        {options.map((item : LanguageItem)=>(
          <button className={optionState.includes(item.id) ? 'options-button-active' : 'options-button'} key={item.id} onClick={()=>addToOptions(item.id)}>
            {languageState === 'french' ? item.french : languageState === 'hebrew' ? item.hebrew : ''} <br />
            {item.time} - {item.price}
          </button>
        ))}
      </div>
      <Link to='/crenaux' className="option-link">Suivant</Link>
    </div>
  )

}

export default Options