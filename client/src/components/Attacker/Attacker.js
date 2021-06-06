import React from 'react'
import { UnitSelector } from '../UnitSelector/UnitSelector'
import {groundAirTargetingValidation, canAttackTargetDefender} from "./Damage"
import "./Attacker.css"

class AttackerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrhap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}


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

const WeaponDisplay = ({available, selected, classes}) => {
  return <>"weapon"</>
  // const cns = []
  // cns.push(index === attacker.weapon ? "main-weapon" : "other-choice");
  // cns.push(available ? "attack-available" : "attack-unavailable");
  // const attacks = ["attack-name"]
  // attacks.push(available? "alt-weapon": "unavailable")
  // attacks.push(available && (defaultIndex === null) ? "pulse": "")
  // console.log('attacks', attacks)
  // console.log('defaultIndex', defaultIndex)
  // return <div key={index} onClick={() => toggleIndex(index)} className={cns.join(" ")}>
  //   <>
  //     <div className={classes.join(" ")} >
  //       <Bullet animate={available && (defaultIndex === null)} display={(true)}/>
  //           {attack.name} {attack.repeats > 1 ? <>(x {attack.repeats})</>: null}
  //     {index === defaultIndex ?
  //       <div>
  //         <>Base Damage: <span className={cn}>{attack.baseDamage} (+{attack.researchBonus})</span></>
  //         <Bonus attack={attack} defender={defender} textstyle={cn}/>
  //       </div>
  //       : null
  //       }
  //       </div>
  //   </>
  // </div>
}

const Attacks = ({attacker, defender, setAttackingWeapon}) => {
  const Attack = ({attack, available, selected}) => {
    const cns = []
    cns.push(attacker?.weapon?.name === attack?.name ? "main-weapon" : "other-choice");
    cns.push(available ? "attack-available" : "attack-unavailable");
    const attacks = ["attack-name"]
    attacks.push(available? "alt-weapon": "unavailable")
    attacks.push(available && (!attacker.weapon ? "pulse": ""))
    console.log('attacks', attacks)
    return <div key={attack.name} onClick={() => setAttackingWeapon(attack)} className={cns.join(" ")}>
      <>
        <div className={attacks.join(" ")} >
          <Bullet animate={attacks.includes("pulse")} display={(true)}/>
              {attack.name} {attack.repeats > 1 ? <>(x {attack.repeats})</>: null}
        {selected ?
          <div>
            <>Base Damage: <span className={attacks.includes("pulse") ? "bullet" : ""}>{attack.baseDamage} (+{attack.researchBonus})</span></>
            <Bonus attack={attack} defender={defender} textstyle={"yellow"}/>
          </div>
          : null
          }
          </div>
      </>
    </div>
  }
  // return "attxs"+JSON.stringify(attacks.l)
//   return attacker?.attacks.map(attack => {
//     return <>
//     <Attack attack={attack}/></>
//   }) 
// // if (!attacks ) {return " no attacker"}
  // return "Attacks"
  const toggleWeapon= (index) => {
      // if(index === defaultIndex){
      //   setAttackingWeapon(null)
      // } else {
      //   setAttackingWeapon(index)
      // }
    }
  const attackMap =  attacker?.attacks.map((attack) => {
    return <Attack attack={attack } available={canAttackTargetDefender(attack, defender)}
                           selected={attack === attacker.weapon} />
    
  
  })

  return <div className={"attacks"}>
    <h1>{attacker?.attacks.length > 0 ? Attacks : "pacifist"}</h1>
      {attacker? attackMap : null} 
  </div>
}

export const Attacker = ({attacker, defender, setAttacker, units}) => {

  const setAttackingWeapon = (weapon) => {
  if(weapon != attacker.weapon){
      setAttacker({
        ...attacker,
        weapon: weapon
      })
    } else {
      setAttacker({
        ...attacker,
        weapon: null
      })
    }
    return null;
  }
  return <AttackerErrorBoundary>
  <UnitSelector setUnit={setAttacker} currentUnit={attacker} units={units}> 
  {attacker?.attacks.length > 0 ? 
      <Attacks attacker={attacker} 
      setAttackingWeapon={setAttackingWeapon} defender={defender} />:
        attacker ?
          <>pacifist</>  :
          "nonthing selected"}
  </UnitSelector>
  </AttackerErrorBoundary>
}
