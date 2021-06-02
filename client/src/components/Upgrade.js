import { inlineStyle } from "./UnitSelector/Unit";
import "./Upgrade.css"

// import styles from '../features/counter/Counter.module.css';

const researchSrcs = {
  attack: "/attack.png",
  armor: "/armor.png",
  shields: "/shield.png"
};

export const Upgrade = ({researchKind, value, updateResearch})=> {
  const incrementByAmount = (amount) => {
    updateResearch(value + amount)
  }

  if(value === null){
    return <></>
  }

  return <>
  <div className={"research"}>
    <div className={"incrementer"}>
      
      <div className={"research-img"} style={{...inlineStyle(researchSrcs[researchKind])}}>
      <div
        aria-label="Increment value"
        onClick={() => (incrementByAmount(1))}
      >   ⨁ </div>
        <h1>{value}</h1>
        <div
          aria-label="Decrement value"
          onClick={() => (incrementByAmount(-1))}
        > ⊖ </div>
      </div>
    </div>
  </div> </>
}