import React from 'react'
import { UnitSelector } from '../UnitSelector/UnitSelector'
import {groundAirTargetingValidation, canAttackTargetDefender} from "./Damage"
import "./Attacker.css"

const Bonus = ({attack, defender, textstyle}) => {

  return attack.bonuses.map((bonus, index) => {
    let baseText = <>Anti-{bonus.to}:</>
    let bonusText = <>{bonus.baseDamage} (+{bonus.researchBonus})</>;
    let modifier;
    
    if(!defender){
      modifier = <span>{bonusText}</span>
    } else {
      // const overlap = false;//groundAirTargetingValidation(attack, defender);
      // if (overlap.length === 0){
      //   modifier = <span> {bonusText} </span>
      // }else{
        if (defender.types.includes(bonus.to) ){
          modifier=  <span>{bonusText} 🎯</span>
        } else {
          modifier= <span style={{textDecoration: "wavy line-through red"}}>{ bonusText}</span>
        }
      // }
    }

    return <div key={index}>
      {baseText}
      <span className={textstyle}>
      {modifier}
      </span>
    </div>
  })  
}

const Bullet = ({animate, display}) => {
  if(display){
    if (animate){
      return <span className={"bullet"}>➡</span>
    } else {
      return <>➡</>
    }
  } else {
    return <></>
  }
}

const Attacks = ({unit, defender, defaultIndex, setDefaultIndex}) => {
  const toggleIndex = (index) => {
      if(index === defaultIndex){
        setDefaultIndex(null)
      } else {
        setDefaultIndex(index)
      }
    }
  const attackMap = unit?.attacks?.map((attack, index) => {
    const cns = []
    cns.push(index === defaultIndex ? "main-weapon" : "other-choice");
    const available = canAttackTargetDefender(attack, defender);
    cns.push(available ? "attack-available" : "attack-unavailable");
    const cn = available ? "success" : "fail";

    const attacks = ["attack-name"]
    attacks.push(available? "alt-weapon": "unavailable")
    attacks.push(available && (defaultIndex === null) ? "pulse": "")
    console.log('attacks', attacks)
    console.log('defaultIndex', defaultIndex)

    return <div key={index} onClick={() => toggleIndex(index)} className={cns.join(" ")}>
      <>
        <div className={attacks.join(" ")} >
          <Bullet animate={available && (defaultIndex === null)} display={(true)}/>
              {attack.name} {attack.repeats > 1 ? <>(x {attack.repeats})</>: null}
        {index === defaultIndex ?
          <div>
            <>Base Damage: <span className={cn}>{attack.baseDamage} (+{attack.researchBonus})</span></>
            <Bonus attack={attack} defender={defender} textstyle={cn}/>
          </div>
          : null
          }
          </div>
      </>
    </div>
  })

  return <div className={"attacks"}>
    {unit?.attacks?.length > 0 ?
      <h1>Attacks</h1> : null}

      {attackMap}
  </div>
}

export const Attacker = ({unit, defender, setUnit, attackIndex, setAttackIndex, units}) => {

  return <>
  <UnitSelector setUnit={setUnit} currentUnit={unit} units={units}> 
      <Attacks unit={unit} defaultIndex={attackIndex} setDefaultIndex={setAttackIndex} defender={defender} />
  </UnitSelector>
  </>
}
