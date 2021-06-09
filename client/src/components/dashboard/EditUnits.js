
import React from "react"
import {useUnits} from "../UnitSelector/Unit"
import "./EditUnits.css"

const UpdateAttribute = ({updateFunction, label, attributeValue, clicks}) => {
  const [value, setValue] = React.useState(attributeValue)
  const [dirty, setDirty] = React.useState(false)

  React.useEffect(() => {
    if(String(value) !== String(attributeValue)){
      setDirty(true)
    } else{
      setDirty(false)
    }
  }, [value])

  React.useEffect(() => {
    if(clicks > 0){
      if(dirty && value !== attributeValue){
        updateFunction(value)
        setDirty(false)
      }
    }
  }, [clicks])

  const style= {
    backgroundColor: dirty? "rgba(255,0,0, .2)" : "rgba(0,255,0, .1)",
  }
  
  return <div className={"row"}>
    <div>{label}</div>
    <input style={style} type="text" onChange={(e) => setValue(e.target.value)} value={value || ""} />
  </div>
}
const assign = (property, value) => {
  const newObject = {};
  newObject[property] = value;
  return newObject;
}

const UpdateBonus = ({bonus, prefix ,updateFunction, clicks}) => {
  return <>
  <UpdateAttribute label={"To"} 
        attributeValue={bonus.to} 
        updateFunction={(val) => 
            updateFunction( assign(prefix+"to", (val)))}
        clicks={clicks} />
  <UpdateAttribute label={"Research Bonus"} 
        attributeValue={bonus.researchBonus} 
        updateFunction={(val) => 
            updateFunction( assign(prefix+"researchBonus", parseInt(val)))}
        clicks={clicks} />
  <UpdateAttribute label={"Base Damage"} 
        attributeValue={bonus.baseDamage} 
        updateFunction={(val) => 
            updateFunction( assign(prefix+"baseDamage", parseInt(val)))}
        clicks={clicks} />
  </>
}

const EditAttack = ({attack, updateFunction, id, clicks}) => {
  
  return <div className={"row"}>
    <div>
      <h3>{attack.name}</h3>
    <UpdateAttribute label={"Attack Name"} 
          attributeValue={attack.name} 
          updateFunction={(val) => 
              updateFunction( assign("attacks."+id+".name", val))}
          clicks={clicks} />
    <EditArray label={"Targets"} arr={attack.targets} updateFunction={updateFunction} prefix={"attacks."+id+".targets."} clicks={clicks} />
    <UpdateAttribute label={"Research Bonus"} 
          attributeValue={attack.researchBonus} 
          updateFunction={(val) => 
              updateFunction( assign("attacks."+id+".researchBonus", parseInt(val)))}
          clicks={clicks} />
    <UpdateAttribute label={"Base Damage"} 
          attributeValue={attack.baseDamage} 
          updateFunction={(val) => 
              updateFunction( assign("attacks."+id+".baseDamage", parseInt(val)))}
          clicks={clicks} />
    <UpdateAttribute label={"Repeats"} 
          attributeValue={attack.repeats} 
          updateFunction={(val) => 
              updateFunction( assign("attacks."+id+".repeats", parseInt(val)))}
          clicks={clicks} />
    </div>
    {attack.bonuses.length > 0 ?<div>
    
    <h4>Bonuses</h4>
    {attack.bonuses.map((bonus, bid) => {
      return <div key={bid}>
        <UpdateBonus bonus = {bonus} 
        prefix={["attacks", id, "bonuses", bid, ""].join(".")}
        updateFunction={updateFunction}
        clicks={clicks}/>
      </div>

    }
    ) } </div>: null }    
  </div>
}

const EditArray = ({label, arr, prefix, updateFunction, clicks}) => {
  console.log('prefix', prefix)
  const elements = arr.map((item, id) => {
    return <div key={id} className={"row"}>
      <div>
        <UpdateAttribute label={null} 
            attributeValue={item} 
            updateFunction={(val) => 
                updateFunction( assign(prefix+id, val))}
            clicks={clicks} />
      </div>
      <div>
        <button onClick={() => updateFunction(assign(prefix.slice(0, -1), item), "$pull")}>Remove</button>
      </div>
    </div>
  })

  const add_element = <button onClick={() => updateFunction(assign(prefix.slice(0, -1), ""), "$push")}>Add Element</button>
  return <>
  <div>{label}</div>
  <div>{elements}</div>
  <div>{add_element}</div>
  </>
}

const EditUnit = ({unit}) => {
  const [response, setResponse] = React.useState(null)
  const [updates, setUpdates] = React.useState(0)

  const updateUnit = (attribute, operation="$set") => {
    const url = "http://localhost:5000/api/update/" + unit._id

    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      json: true,
      mode: 'cors',
      body: JSON.stringify({
        operation: operation,
        attribute: attribute
      }),
    }).then(data => {
      data.json()
      console.log('data', data)
      setResponse(data)
    })
  }
  
  return <>
  <div className={"update-attributes"}>
    <div>
        <h2>{unit.name}</h2>
          <UpdateAttribute label={"Builds at: "} 
                attributeValue={unit.structure} 
                updateFunction={(val) => 
                    updateUnit( {"structure" : (val)} )}
                clicks={updates} />
        <h2>Types</h2>
        <EditArray arr={unit.types} updateFunction={updateUnit} prefix={"types."} clicks={updates} />
        <div>
          <h2>Base Stats</h2>
          <UpdateAttribute label={"Health"} 
                attributeValue={unit.base.health} 
                updateFunction={(val) => 
                    updateUnit( {"base.health" : parseInt(val)} )}
                clicks={updates} />
          <UpdateAttribute label={"Armor"} 
                attributeValue={unit.base.armor} 
                updateFunction={(val) => 
                    updateUnit( { "base.armor" : parseInt(val) } )}
                clicks={updates} />
          {unit.base.shields?
            <UpdateAttribute label={"Shields"} 
                attributeValue={unit.base.shields} 
                updateFunction={(val) => 
                    updateUnit( { "base.shields" : parseInt(val)} )}
                clicks={updates} />
            : null}
        </div>
    </div>
    <div>
        <h2>Attacks</h2>
        {unit.attacks.map((attack ,id) => <div key={id}>
          <EditAttack 
                attack={attack} 
                id={id}
                clicks={updates}
                updateFunction={updateUnit}/>
          </div>)}
        <button onClick={() => setUpdates(updates+1)}>Update Responses</button>
    </div>
  </div>
  </>
}

export const EditUnits = () => {
  const [locked, units] = useUnits()

  return <>
  <div className={"container"}>
    {!locked ? <>wating for units to load </> : 
      units?.filter(unit => unit.name === "Siege Tank").map(unit => <div key={unit._id}> <EditUnit unit={unit}/> </div>)
    }
  </div>
  </>
}