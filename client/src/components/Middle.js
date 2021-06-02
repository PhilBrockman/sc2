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
              text = <span className={"pulse"}>⬅ Select a valid attack</span>
              animateValidAttacks("alt-weapon", true)
            }
      else{
        cns.push("invalid")
        text = <>{attacker.name} can't attack {defender.name}</>
        doubleReroll=true
      }

    } else {
      cns.push("waiting")
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
    console.log('newValues', newValues)
    let newDefender = defender;
    console.log('aidx', aidx)
    if(newValues && aidx !== undefined && aidx !== null){
      console.log('staritng for loop')
      // for(var i = 0; i < attacker.attacks[aidx].repeats; i++){
        // console.log('looping', i)
        if(newValues.health > 0 || true){
        console.log("updatinghealth")
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
            console.log('newDefender', newDefender)
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

  return<>  {defender?
    <>
      <div className={"vitality"}>
        
        <div className={"avatar"}>
          <UnitImg unit={defender} label={<div className={"vitality-stats"}>
          {baseShields ? <>
            <div className={"shields"}>
              
              <div>{defender.base.shields} / {baseShields}<>🧊</></div>
            </div>
            
            </>: null}
            <div className={"health"}>
              <div><span style={{color: healthColor}}>{defender.base.health} / {baseHealth} <>♥️</></span></div>
            </div>
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
          {defender?.base.shields ?  <Upgrade researchKind={"shields"} updateResearch={setShieldsResearch} value={shieldsResearch} /> :null }
        </div>
        <div>{defender?.base.shields ?  <UnitImg unit={defender} label={<div className={"attacker-damage"}><div>{shieldsResearch}</div><div>🧊</div></div>} />: null}</div>

        <div></div>
          <div>{defender? <Upgrade researchKind={"armor"} updateResearch={setArmorResearch} value={armorResearch} /> : null }</div>
        <div>{defender ? <UnitImg unit={defender} label={<div className={"attacker-damage"}><div>{defender.base.armor+armorResearch}</div><div>🛡</div></div>}/>: null}</div>
      </div> 
    </>
    }

export const Middle = ({attacker, defender, aidx, research, setDefender, setAttacker, units}) => {

  if(!research || !units){
    return units ?  "no rsearch":  "or no units";
  } else {
    const [attackResearch, setAttackResearch, shieldsResearch, setShieldsResearch, armorResearch, setArmorResearch] = research
    
    const backup = new Damage(JSON.parse(JSON.stringify(attacker)),
                          JSON.parse(JSON.stringify(defender)), aidx,
                          [ attackResearch, shieldsResearch, armorResearch]
                          )
              
    return <div className={"middle"}>
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