import React from 'react';
import './App.css';
import {Attacker} from "./components/Attacker/Attacker"
import {canAttackTargetDefender} from "./components/Attacker/Damage"
import {Defender} from "./components/Defender"
import {Middle} from   "./components/Middle"
import {useUnits} from "./components/UnitSelector/Unit"

function App() {
  const [shieldsResearch, setShieldsResearch1] = React.useState(0)
  const [armorResearch, setArmorResearch1] = React.useState(0)
  const [attackResearch, setAttackResearch1] = React.useState(0);

  const setShieldsResearch = (val) =>{
    if(val >= 0 && val <= 10){
      setShieldsResearch1(val)
    }
  }

  const setArmorResearch = (val) =>{
    if(val >= 0 && val <= 10){
      setArmorResearch1(val)
    }
  }

  const setAttackResearch = (val) =>{
    if(val >= 0 && val <= 10){
      setAttackResearch1(val)
    }
  }

  const [attackIndex, setAttackIndex] = React.useState(null)
  const [autoSelected, setAutoSelected] = React.useState(false)

  const [locked, loadingUnits] = useUnits()
  const [units, setUnits] = React.useState(null)

  const [attacker, setAttacker] = React.useState(null)
  const [defender, setDefender] = React.useState(null)

  const [width, setWindowWidth] = React.useState(0)
   React.useEffect(() => { 

     updateDimensions();

     window.addEventListener("resize", updateDimensions);
     return () => 
       window.removeEventListener("resize",updateDimensions);
    }, [])
    const updateDimensions = () => {
      const width = window.innerWidth
      setWindowWidth(width)
    }

  React.useEffect(() => {
    if(locked){
      setUnits(loadingUnits)
    }
  }, [locked, loadingUnits])

  React.useEffect(() => {
    setAttackIndex(null)
    setAutoSelected(false)
  }, [attacker, setAttackIndex])

  React.useEffect(() => {
    const selectAttack = (att) => {
      if(units){
        if(attackIndex) {
          // setAtta(null);
        } else {
          // if(canAttackTargetDefender(attacker?.attacks[attackIndex], defender)) {return; }
          const validAttack = attacker?.attacks?.filter(attack => canAttackTargetDefender(attack, defender))
          if(!autoSelected) {
            console.log("setting attack")
            setAttackIndex(attacker?.attacks.indexOf(validAttack[0]))
            setAutoSelected(true)
          } 
          }
        }
    }
    selectAttack(attacker)
  }, [attacker, defender, attackIndex, units, autoSelected])

  const large = width > 950;

  const ainfo = <div className={"container"}>
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
                </div>;

  const middle = <div className={"container"}>
                  <Middle
                    attacker={attacker}
                    defender={defender}
                    aidx={attackIndex}
                    research={[attackResearch, setAttackResearch, shieldsResearch, setShieldsResearch, armorResearch, setArmorResearch]}
                    setDefender={setDefender}
                    setAttacker={setAttacker}
                    units={units}
                    large ={large}
                  /></div>;

  const dinfo = <div className={"container"}>
                  <div className={"defender"}>
                    <h1 style={{fontSize: "1.7em", textAlign:"center"}}>Defender</h1>
                    <Defender unit={defender} 
                              setUnit={setDefender} 
                              units={units}/>
                  </div> 
                </div>;

          // 
    return (
      <div className="App">
        
          {large ? <div className={"arena"}>{ainfo} {middle} {dinfo} </div>: <>{middle} <div className={"arena"}>{ainfo} {dinfo} </div></>}
          
        
      </div>
    );
}



export default App;
