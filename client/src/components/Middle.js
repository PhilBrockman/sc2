import React from "react"
import {Upgrade} from "./Upgrade"
import {canAttackTargetDefender, Damage} from "./Attacker/Damage"
import { UnitImg, inlineStyle } from './UnitSelector/Unit'
import {RandomButton} from "./UnitSelector/UnitSelector"
import "./Middle.css"
 
const animateValidAttacks = (cname, keep) => {
  Array.from(document.getElementsByClassName(cname)).forEach(elem => {
    if(keep){
      elem.classList.add("pulse") 
    } else{
      elem.classList.remove("pulse") 
    }
  })
}


const validAttacks = (attacker, defender) => {
  return attacker?.attacks.filter(attack => {
    return canAttackTargetDefender(attack, defender)
  })
}

const validAttackExists = (attacker, defender) => {
  return validAttacks(attacker, defender).filter(item => item).length > 0
}


const DPS = ({attacker, defender,  attackResearch, shieldsResearch, armorResearch, setDefender, setAttacker, units}) => {
  let d = new Damage(attacker, defender, [ attackResearch, shieldsResearch, armorResearch])
  const active = attacker?.weapon && defender
  const cns = ["button"];

  
  let doubleReroll
  let text 
  if(active){
    cns.push("active")
    animateValidAttacks("alt-weapon", false)
    if(canAttackTargetDefender(attacker.weapon, defender)){
      if(d?.oneShot()){
        console.log("oneshot", d.oneShot())
        text = <div style={{display: "flex", flexDirection:"column"}}><div style={{fontSize:"1.5em"}}>Damage:</div> <div>⚔️ {d.oneShot().totalDamage} 🛡</div></div>
      } else {
        text = <>Victory (reset)</>
      }
    }else {
      text=<>{attacker.weapon.name} cannot target {defender.name}</>
      cns.push("inactive")
    }
  } else {
    if (attacker && defender) {
      cns.push("inactive")
      if(validAttackExists(attacker, defender)){
              console.log('attacker: )', validAttacks(attacker, defender) )
              text = <span>⬅ Select a valid attack</span>
              cns.push("pulse")
              animateValidAttacks("alt-weapon", true)
      } else{
        cns.push("invalid")
        text = <>{attacker.name} can't attack {defender.name}</>
        doubleReroll=true
      }

    } else {
      cns.push("waiting")
      if (!attacker && !defender) {cns.push("pulse")}
      text= <div>
                 <div>Select: </div>
                <div>{!attacker ? <div className={"attacker row"}><RandomButton display={units} randomize={() => setAttacker(units[Math.floor(Math.random()*units.length)])} randomText={"🎲  ⬅ Attacker"}/>  </div>: null}</div>
                <div>{!defender? <div className={"defender row"}><RandomButton display={units} position={setDefender} randomize={() => setDefender(units[Math.floor(Math.random()*units.length)])} randomText={"Defender ➡ 🎲 "} /> </div>: null}</div>        
              </div>
    }
  }

  const resetDefender = () => {
    if(defender?.name) {
     setDefender(units.find(unit => unit.name === defender.name))
     }
  }

  const updateHealth = () => {
    if(!attacker || !defender) return;
    let newValues = d.oneShot();
    let newDefender = defender;
    if(newValues && attacker.weapon){
      for(var i = 0; i < 1; i++){

          let newValues = d.oneShot();
          if(newValues){
            newDefender = {
              ...newDefender,
              base: {
                ...newDefender.base,
                health: newValues.health,
                shields: newValues.shields,
              }
            }
            }
          d = new Damage(JSON.parse(JSON.stringify(attacker)),
          JSON.parse(JSON.stringify(newDefender)),
          [ attackResearch, shieldsResearch, armorResearch]
            )
            
     }
     setDefender(newDefender)
    } else {
      resetDefender()
    }
  }

  const callback = () => {
    if(attacker){
      console.log('attakcer', attacker)
      if(validAttackExists(attacker, defender)){
        console.log("valid attack exists")
        if(!attacker.weapon){
          const attacks = validAttacks(attacker, defender)
          console.log('attacks from attacker', attacks)
          setAttacker({
            ...attacker,
            weapon: attacks[0]
          })
          }
          else {
            if(canAttackTargetDefender(attacker.weapon, defender)){
              updateHealth()
              }
          }
      } else {
        console.log("no attack exists")
      }
    } else {
      console.log("no attacker", attacker)
    }
  }

  return <div className={"DPS"}>
            <div><span className={cns.join(" ")} onClick={callback}>{text}</span></div>
            {doubleReroll ? <>
              <div className={"button"}><RandomButton display={units} position={setDefender} randomize={() => {setDefender(units[Math.floor(Math.random()*units.length)]); setAttacker(units[Math.floor(Math.random()*units.length)])}} randomText={"Reroll 🎲 Units"}/></div>
            </> : null}
        </div>
}

const Vitality = ({defender, units, setDefender, shieldResearch, armorResearch}) => {
  const base = units?.find(unit => defender?.name === unit.name)?.base
  const baseTypes = units?.find(unit => defender?.name === unit.name)?.types
  const health = defender?.base.health/base?.health

  const healthColor = health > 6/7 ? "green" :
                        health > 4/7 ? "yellow":
                          health > 2/7 ? "orange":
                                            "red";

  const setAttribute = (val, attr,) => {
    const newBase = {...defender.base}
    newBase[attr] = parseInt(val)
    console.log('newBase', newBase)
    setDefender({
      ...defender,
      base: {...newBase}
    })
  }



  React.useEffect(() => {
    // console.log('defender', defender.base)
  }, [defender])

  const UpdateAttr = ({ val, updater, attr, followup}) => {
    const [holderValue, setHolderValue] = React.useState(val)
    const [editing, setEditing] = React.useState(false)
    const newStyle = editing? {justifyContent: "space-evenly"} : null;

    return <div className={"row astlye"} style={newStyle}>
      {editing? <div className={"row"}>
        <input type={"text"} value={holderValue} onChange={(e) => setHolderValue(e.target.value)} style={{width: "50px"}}/>
        <div onClick={() => {setEditing(false)  ; updater(holderValue, attr) }}>✅</div>
        <div onClick={() => {setHolderValue(val); setEditing(false)}}>❌</div>
        </div>:
        //textDecoration: "underline"
      <div style={{border: "3px solid", padding:"3px"} }onClick={() => setEditing(true)}>{holderValue}</div>  }
      <div>&nbsp;{followup}</div>
    </div>
    } 
    // armorResearch, shieldResearch 

  const armorResearchImg = <div className={"research-img"} style={{...inlineStyle("/armor.png"), backgroundPosition: "center", textAlign:"center"}}>
    {armorResearch}
  </div>
  return<>  {defender?
    <>
      <div className={"vitality"}>        
        <div className={"avatar"}>
          <UnitImg unit={defender} label={<div className={"vitality-stats"}>
          {base.shields ? <>
            <div className={"shields"}>
              <div><UpdateAttr val={defender.base.shields} updater={setAttribute} attr={"shields"} followup={<> / {base.shields}🧊</>} /></div>
            </div>
            </>: null}
            <div className={"health"}>
              <div><span style={{color: healthColor}}>{<UpdateAttr val={defender.base.health} updater={setAttribute} attr={"health"} followup={<> / {base.health} ♥️</>}/>}</span></div>
            </div>
            <div className={"row"}><div>{defender.base.armor+defender.research.armor*armorResearch} 🛡</div>= <UpdateAttr val={defender.base.armor} updater={setAttribute} attr={"armor"}/> + <>{armorResearchImg}</></div>
            <div style={{ textAlign:"right"}}>
          { (defender.base !== base || defender.types !== baseTypes) ? 
              <span onClick={() => setDefender(units?.find(unit => defender?.name === unit.name))}>Reset</span> : null}
              </div>
        </div>}/>
        </div>
      </div>
    </>: null}</>

}

const AllUpgrades = ({attacker, defender, attackResearch, setAttackResearch, shieldsResearch, setShieldsResearch, armorResearch, setArmorResearch})  => {
  let d = attacker && defender ?
              new Damage(attacker, defender, [ attackResearch, shieldsResearch, armorResearch]) :
              null;
  const targetable = attacker?.attacks?.filter(attack => canAttackTargetDefender(attack, defender)).length > 0

  const attackerDamage = d ? (targetable && !d.damageDealt())?  "⬅":
    (targetable && d.damageDealt()) ? 
    <div className={"attacker-damage"}><div>{d.damageDealt() }</div><div>⚔️</div></div>:
        defender ?
          <span className={"fail"}>🥊</span>:
          <>→</>:
                            "";
  
    return <>
    <div className={"unit-stats"}>
        <div>{attacker ? <UnitImg unit={attacker} label={(attackerDamage)} /> : null}</div>
          <div>{attacker ? <Upgrade researchKind={"attack"} updateResearch={setAttackResearch} value={attackResearch} /> : null }</div>
        <div></div>

        <div></div>
        <div>
          {defender?.base.shields >= 0 ?  <Upgrade researchKind={"shields"} updateResearch={setShieldsResearch} value={shieldsResearch} /> :null }
        </div>
        <div>{defender?.base.shields ?  <UnitImg unit={defender} label={<div className={"attacker-damage"}><div>{shieldsResearch}</div><div>🧊</div></div>} />: null}</div>

        <div></div>
          <div>{defender? <Upgrade researchKind={"armor"} updateResearch={setArmorResearch} value={armorResearch} /> : null }</div>
        <div>{defender ? <UnitImg unit={defender} label={<div className={"attacker-damage"}></div>}/>: null}</div>
      </div> 
    </>
    }


export const Middle = ({attacker, defender, research, setDefender, setAttacker, units, large}) => {

  if(!research || !units){
    return units ?  "no research (error)":  "Note: Heroku Dynos are spinning up... Sorry for the inconevience. Please wait!";
  } else {
    const [attackResearch, setAttackResearch, shieldsResearch, setShieldsResearch, armorResearch, setArmorResearch] = research
    
    const backup = new Damage(JSON.parse(JSON.stringify(attacker)),
                          JSON.parse(JSON.stringify(defender)),
                          [ attackResearch, shieldsResearch, armorResearch]
                          )
    const cns = ["middle"]
    if(!large) {cns.push("middle-row")}
    return <div className={cns.join(" ")}>
              <div>
                <DPS attacker={attacker} defender={defender}
                    attackResearch={attackResearch} armorResearch={armorResearch} shieldsResearch={shieldsResearch}
                    setDefender={setDefender} setAttacker={setAttacker} units={units}  />

                <Vitality defender={defender} setDefender={setDefender} units={units} armorResearch={armorResearch} shieldresearch={shieldsResearch} />
                {canAttackTargetDefender(attacker?.weapon, defender) ? <div className={"eliminator"}>Eliminates in {backup.eliminate()} attack{backup.eliminate() === 1 ? "" : "s"}.</div> : null}
              </div>
              <div>
                {attacker || defender ? <h2>Unit Upgrades</h2> :  <h2 style={{opacity: .2}}>Unit Upgrades</h2>  }
                <AllUpgrades attacker={attacker} defender={defender} attackResearch={attackResearch} setAttackResearch={setAttackResearch}
                      shieldsResearch={shieldsResearch} setShieldsResearch={setShieldsResearch} armorResearch={armorResearch} setArmorResearch={setArmorResearch} />
              </div>
           </div>

  }
}