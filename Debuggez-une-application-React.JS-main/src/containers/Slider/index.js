import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  
  // Ajout d'une vérification
  const byDateDesc = data?.focus?.length > 0 
  ? [...data.focus].sort((evtA, evtB) => 
      new Date(evtA.date) - new Date(evtB.date)
    ) 
  : [];

const nextCard = () => {
  setIndex(index < byDateDesc.length - 1 ? index + 1 : 0);
};

useEffect(() => {
  const timer = setTimeout(nextCard, 5000);
  return () => clearTimeout(timer);
}, [index, byDateDesc.length]);

if (byDateDesc.length === 0) return null;

  // permet de rendre les boutons actifs
  const handleChange = (radioIdx) => {
    setIndex(radioIdx);
  };

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
            >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
      ))} 
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((radioEvent, radioIdx) => (
            <input
              key={radioEvent.title}
              type="radio"
              name="radio-button"
              // idx remplacé par index (index du slider)
              checked={index === radioIdx}
              onChange={() => handleChange(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;

