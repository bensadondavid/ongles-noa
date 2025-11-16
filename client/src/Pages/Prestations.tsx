import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { addPrestation, deletePrestation } from "../Store/PrestationSlice"
import type { RootState } from "../Store/Store";

interface LanguageHeader {
  french: string;
  hebrew: string;
}

interface LanguageItem {
  slug: string;
  french: string;
  hebrew: string;
  time : string;
  price : string
}

function Prestations() {

  const dispatch = useDispatch()
  const prestationState = useSelector((state : RootState)=> state.prestations)
  const languageState = useSelector((state : RootState) => state.language)
  
  const headers: LanguageHeader[] = [
  { french: "Prestations", hebrew: "טיפולים" },
  { french: "liste", hebrew: "רשימה" },
];

  const prestations: LanguageItem[] = [
    { slug: "manucure-soins-ongles", french: "Manucure et soins des ongles", hebrew: "מניקור וטיפוח הציפורניים", time : '30mn', price : '50sh' },
    { slug: "deposes-de-gel", french: "Déposes de gel", hebrew: "הסרת ג׳ל" , time : '10mn', price : '20sh'},
    { slug: "deposes-de-faux-ongles", french: "Déposes de faux ongles", hebrew: "הסרת ציפורניים מלאכותיות", time : '30mn', price : '40sh' },
    { slug: "manucure-russe-et-gainage", french: "Manucure russe et gainage", hebrew: "מניקור רוסי וחיזוק הציפורן", time : '1h10', price : '110sh' },
    { slug: "manucure-russe-et-semi-permanent", french: "Manucure russe et semi permanent", hebrew: "מניקור רוסי ולק קבוע", time : '50mn', price : '100sh' },
    { slug: "capsules-gel-x", french: "Capsules gel x", hebrew: "קפסולות ג׳ל X" , time : '1h30', price : '210sh'},
    { slug: "pedicure-et-semis-permanent", french: "Pedicure et semis permanent", hebrew: "פדיקור ולק קבוע", time : '1h', price : '140sh' },
  ];

  const addToPrestations = (slug : string)=>{
   if (prestationState.includes(slug)) {
    dispatch(deletePrestation(slug))
  } else {
    dispatch(addPrestation(slug))
  }
  }

  return (
    <div className="prestations">
      <p className="prestations-title">{languageState === 'french' ? headers[0].french : languageState === "hebrew" ? headers[0].hebrew : ""}</p>
      <p className="prestations-subtitle">{languageState === 'french' ? headers[1].french : languageState === "hebrew" ? headers[1].hebrew : ""}</p>

      <div className="prestations-list">
        {prestations.map((item : LanguageItem)=>(
          <button className={prestationState.includes(item.slug) ? 'prestations-button-active' : 'prestations-button'} key={item.slug} onClick={()=>addToPrestations(item.slug)}>
            {languageState === 'french' ? item.french : languageState === 'hebrew' ? item.hebrew : ''} <br />
            {item.time} - {item.price}
          </button>
        ))}
      </div>
      <Link to='/options' className="prestation-link">Suivant</Link>
    </div>
  )

}

export default Prestations