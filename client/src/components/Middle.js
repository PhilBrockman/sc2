import React from "react"
import {Upgrade} from "./Upgrade"
import {canAttackTargetDefender, Damage} from "./Attacker/Damage"
import { UnitImg } from './UnitSelector/Unit'
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

const DPS = ({attacker, defender, aidx,  attackResearch, shieldsResearch, armorResearch, setDefender, setAttacker, units}) => {
  let d = new Damage(attacker, defender, aidx, [ attackResearch, shieldsResearch, armorResearch])
  const active = attacker?.attacks? canAttackTargetDefender(attacker.attacks[aidx], defender) : null;
  const cns = ["button"];

  let text
  let doubleReroll
  if(active){
    cns.push("active")
    animateValidAttacks("alt-weapon", false)
    if(d.oneShot()){
      text = <div style={{display: "flex", flexDirection:"column"}}><div style={{fontSize:"1.5em"}}>Damage:</div> <div>⚔️ {d.oneShot().totalDamage} 🛡</div></div>
    } else {
      text = <>Victory (reset)</>
    }
  } else {
    if (attacker && defender) {
      cns.push("inactive")
      if(attacker.attacks.map(attack => {
              return canAttackTargetDefender(attack, defender)
            }).filter(item => item).length > 0){
              text = <span>⬅ Select a valid attack</span>
              cns.push("pulse")
              animateValidAttacks("alt-weapon", true)
            }
      else{
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
    if(newValues && aidx !== undefined && aidx !== null){
      // for(var i = 0; i < attacker.attacks[aidx].repeats; i++){
        // console.log('looping', i)
        if(newValues.health > 0 || true){
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
          JSON.parse(JSON.stringify(newDefender)), aidx,
          [ attackResearch, shieldsResearch, armorResearch]
            )
            } else {
              console.log(">>>>>failed health chi")
            }
    //  }
     setDefender(newDefender)
    } else {
      resetDefender()
    }
  }

  return <div className={"DPS"}>
            <div><span className={cns.join(" ")} onClick={() => updateHealth()}>{text}</span></div>
            {doubleReroll ? <>
              <div className={"button"}><RandomButton display={units} position={setDefender} randomize={() => {setDefender(units[Math.floor(Math.random()*units.length)]); setAttacker(units[Math.floor(Math.random()*units.length)])}} randomText={"Reroll 🎲 Units"}/></div>
            </> : null}
        </div>
}

const Vitality = ({defender, units, setDefender}) => {
  const baseShields = units?.find(unit => defender?.name === unit.name)?.base.shields
  const baseHealth = units?.find(unit => defender?.name === unit.name)?.base.health

  const health = defender?.base.health/baseHealth
  const healthColor = health > 6/7 ? "green" :
                        health > 4/7 ? "yellow":
                          health > 2/7 ? "orange":
                                            "red";

  const setAttribute = (val, attr) => {
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

  const UpdateAttr = ({ val, updater, attr, followup }) => {
    const [holderValue, setHolderValue] = React.useState(val)
    const [editing, setEditing] = React.useState(false)
    const newStyle = editing? {justifyContent: "space-evenly"} : null;

    return <div className={"row"} style={newStyle}>
      {editing? <>
        <input type={"text"} value={holderValue} onChange={(e) => setHolderValue(e.target.value)} style={{width: "50px"}}/>
        <div onClick={() => {setEditing(false)  ; updater(holderValue, attr) }}>✅</div>
        <div onClick={() => {setHolderValue(val); setEditing(false)}}>❌</div>
        </>:
      <div style={{textDecoration: "underline"}}onClick={() => setEditing(true)}>{holderValue}</div>  }
      <div>&nbsp;{followup}</div>
    </div>
    } 

  return<>  {defender?
    <>
      <div className={"vitality"}>        
        <div className={"avatar"}>
          <UnitImg unit={defender} label={<div className={"vitality-stats"}>
          {baseShields ? <>
            <div className={"shields"}>
              <div><UpdateAttr val={defender.base.shields} updater={setAttribute} attr={"shields"} followup={<> / {baseShields}🧊</>} /></div>
            </div>
            </>: null}
            <div className={"health"}>
              <div><span style={{color: healthColor}}>{<UpdateAttr val={defender.base.health} updater={setAttribute} attr={"health"} followup={<> / {baseHealth} ♥️</>}/>}</span></div>
            </div>
            <div><UpdateAttr val={defender.base.armor} updater={setAttribute} attr={"armor"} followup={<> 🛡</>}/></div>
            <div style={{ textAlign:"right"}}>
          { (defender.base.health !== baseHealth || defender.base.shields !== baseShields) ? 
              <span onClick={() => setDefender(units?.find(unit => defender?.name === unit.name))}>Reset</span> : null}
              </div>
        </div>}/>
        </div>
      </div>
    </>: null}</>

}

const AllUpgrades = ({attacker, defender, aidx, attackResearch, setAttackResearch, shieldsResearch, setShieldsResearch, armorResearch, setArmorResearch})  => {
  let d = attacker && defender ?
              new Damage(attacker, defender, aidx, [ attackResearch, shieldsResearch, armorResearch]) :
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
        <div>{defender ? <UnitImg unit={defender} label={<div className={"attacker-damage"}><div>{defender.base.armor+defender.research.armor*armorResearch}</div><div>🛡</div></div>}/>: null}</div>
      </div> 
    </>
    }


export const Middle = ({attacker, defender, aidx, research, setDefender, setAttacker, units, large}) => {

  if(!research || !units){
    return units ?  "no rsearch":  "or no units";
  } else {
    const [attackResearch, setAttackResearch, shieldsResearch, setShieldsResearch, armorResearch, setArmorResearch] = research
    
    const backup = new Damage(JSON.parse(JSON.stringify(attacker)),
                          JSON.parse(JSON.stringify(defender)), aidx,
                          [ attackResearch, shieldsResearch, armorResearch]
                          )
    const cns = ["middle"]
    if(!large) {cns.push("middle-row")}
    return <div className={cns.join(" ")}>
              <div>
                <DPS attacker={attacker} defender={defender} aidx={aidx}
                    attackResearch={attackResearch} armorResearch={armorResearch} shieldsResearch={shieldsResearch}
                    setDefender={setDefender} setAttacker={setAttacker} units={units}/>
                <Vitality defender={defender} setDefender={setDefender} units={units}/>
                {canAttackTargetDefender(attacker?.attacks[aidx], defender) ? <div className={"eliminator"}>Eliminates in {backup.eliminate()} attack{backup.eliminate() === 1 ? "" : "s"}.</div> : null}
              </div>
              <div>
                {attacker || defender ? <h2>Unit Upgrades</h2> :  <h2 style={{opacity: .2}}>Unit Upgrades</h2>  }
                <AllUpgrades attacker={attacker} defender={defender} aidx={aidx} attackResearch={attackResearch} setAttackResearch={setAttackResearch}
                      shieldsResearch={shieldsResearch} setShieldsResearch={setShieldsResearch} armorResearch={armorResearch} setArmorResearch={setArmorResearch} />
              </div>
           </div>

  }
}