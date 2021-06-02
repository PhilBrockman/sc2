import React from 'react';
import './App.css';
import {Attacker} from "./components/Attacker/Attacker"
import {canAttackTargetDefender} from "./components/Attacker/Damage"
import {Defender} from "./components/Defender"
import {Middle} from   "./components/Middle"
import {useUnits} from "./components/UnitSelector/Unit"

function App() {
  const [shieldsResearch, setShieldsResearch] = React.useState(0)
  const [armorResearch, setArmorResearch] = React.useState(0)
  const [attackResearch, setAttackResearch] = React.useState(0);

  const [attackIndex, setAttackIndex] = React.useState(null)

  const [locked, loadingUnits] = useUnits()
  const [units, setUnits] = React.useState(null)

  const [attacker, setAttacker] = React.useState(null)
  const [defender, setDefender] = React.useState(null)

  React.useEffect(() => {
    if(locked){
      setUnits(loadingUnits)
    }
  }, [locked, loadingUnits])


  React.useEffect(() => {
    if(units){
      if(canAttackTargetDefender(attacker?.attacks[attackIndex], defender)) {return; }
      const validAttack = attacker?.attacks?.filter(attack => canAttackTargetDefender(attack, defender))
      if(!validAttack || validAttack.length === 0 || validAttack.length > 1){
        setAttackIndex(null)
        } else {
          setAttackIndex(attacker.attacks.indexOf(validAttack[0]))
        }
        }
  }, [attacker, defender])

          // 
    return (
      <div className="App">
        <div className={"arena"}>
          <div className={"container"}>
            <div className={"attacker"}>
            <h1 style={{fontSize: "1.7em", textAlign:"center"}}>Attacker</h1>
            <Attacker
              unit={attacker}
              defender={defender}
              attackIndex={attackIndex}
              setAttackIndex={setAttackIndex}
              setUnit={setAttacker}
              units={units}
              />
              
              </div>
          </div>
          <div className={"container"}>
            <Middle
              attacker={attacker}
              defender={defender}
              aidx={attackIndex}
              research={[attackResearch, setAttackResearch, shieldsResearch, setShieldsResearch, armorResearch, setArmorResearch]}
              setDefender={setDefender}
              setAttacker={setAttacker}
              units={units}
            />
          </div>
          <div className={"container"}>
            <div className={"defender"}>
              <h1 style={{fontSize: "1.7em", textAlign:"center"}}>Defender</h1>
              <Defender unit={defender} 
                        setUnit={setDefender} 
                        units={units}/>
            </div> 
          </div>
        </div>
      </div>
    );
}



export default App;
