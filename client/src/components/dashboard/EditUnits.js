
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
  
  return <div className={"row attr"}>
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
        attributeValue={bonus?.to} 
        updateFunction={(val) => 
            updateFunction( assign(prefix+"to", (val)))}
        clicks={clicks} />
  <UpdateAttribute label={"Research Bonus"} 
        attributeValue={bonus?.researchBonus} 
        updateFunction={(val) => 
            updateFunction( assign(prefix+"researchBonus", parseInt(val)))}
        clicks={clicks} />
  <UpdateAttribute label={"Base Damage"} 
        attributeValue={bonus?.baseDamage} 
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

       <div>
          <button onClick={() => updateFunction(assign("attacks."+id+".bonuses", {baseDamage: 1}), "$push")}>Add Bonus</button>
      </div>
    </div>
    {attack.bonuses.length > 0 ?<div>
    
    <h4>Bonuses</h4>
    <div>
      {JSON.stringify(attack.bonuses)}
    {attack.bonuses.map((bonus, bid) => {
      const prefix = ["attacks", id, "bonuses", bid, ""].join(".");
      // console.log('assign(prefix+"to", bonus?.to)', assign(prefix+"to", bonus?.to))
      return <div key={bid} className={"row"}><div>
        <UpdateBonus bonus = {bonus} 
        prefix={prefix}
        updateFunction={updateFunction}
        clicks={clicks}/>
        </div>
        <div>
        <button onClick={() => {
            updateFunction(assign(["attacks", id, "bonuses", bid].join("."),  1  ),  "$unset")
              .then(() => {
                console.log("inner funciton")
                updateFunction(assign(["attacks", id, "bonuses"].join(".")     , null),  "$pull" )})
            }}>Remove Bonus</button>
        </div>
      </div>

    }
    ) }</div> </div>: null }    
  </div>
}

const EditArray = ({label, arr, prefix, updateFunction, clicks}) => {
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

const EditUnit = ({og_unit}) => {
  const [unit, setUnit] = React.useState(og_unit)
  const [updates, setUpdates] = React.useState(0)

  const  updateUnit = async (attribute, operation="$set") => {
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
    }).then(data => data.json())
    .then(data => {
      setUnit(data.unit.value)
    }, error => {
      console.log("Error!")
    })
  }

  return <>
  <div className={"row edit-unit"}>
    <div>
    <button className={"update-button"} onClick={() => setUpdates(updates+1)}><h2>{unit.name}</h2></button>
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
        <div>
          <h2>Image</h2>
          <UpdateAttribute label={<img src={unit.img} style={{maxWidth: "150px"}}/>}
                attributeValue={unit.img} 
                updateFunction={(val) => 
                    updateUnit( {"img" : (val)} )}
              clicks={updates} />
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
        
    </div>
  </div>
  </>
}

export const EditUnits = () => {
  const [locked, units] = useUnits()
  console.log("I'm rerunning the call")

  return <>
  <div className={"container"}>
    {!locked ? <>wating for units to load </> : 
      units?.sort((a, b) => {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if(nameA < nameB){
          return -1;
        } if (nameA > nameB){
          return 1;
        } 
        return 0;
      }).map(unit => <div key={unit._id}> <EditUnit og_unit={unit}/> </div>)
    }
  </div>
  </>
}