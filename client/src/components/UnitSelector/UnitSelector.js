import React from "react"
import {Unit, inlineStyle} from "./Unit"
// import { useSpring, animated } from 'react-spring'

import "./UnitSelector.css"

const factions = {
  terran: {
    icon: "/marine.png",
    production: {
      commandcenter: "/commandcenter.png",
      barracks: "/barracks.png",
      factory: "/factory.png",
      starport: "/starport.png",
    }
  },
  zerg: {
    icon: "/zergling.png",
    production: {
      hatchery: "/hatchery.png",
      lair: "/lair.png",
      hive: "/hive.png"
    }
  },
  protoss: {
    icon: "/zealot.png",
    production: {
      nexus: "/nexus.png",
      gateway: "/gateway.png",
      roboticsFacility: "/robo.png",
      stargate: "/stargate.png"
    }
  }
}
const camel2str = (str) => {
   // adding space between strings
  const result = str.replace(/([A-Z])/g,' $1');

  // converting first character to uppercase and join it to the final string
  const final = result.charAt(0).toUpperCase()+result.slice(1);
  return final
}

export const RandomButton = ({display, randomize, randomText }) => {
  let button;

  if(display){
    button = <span onClick={() => randomize()}>
                {randomText || <>🎲</>}
            </span>
  } else {
    button = <button>Loading...</button>
  }

  return <div className={"random-button"}>
      {button}
    </div>
}

const ResetButton = ({unit, setUnit}) => {
return <div className={"reset-button"} onClick={() => setUnit(null)}>
        ↻
      </div>
}

const ButtonGroup = ({unit, setUnit, randomizeUnit, display}) => {
  return <div className={"button-group"}> 
    <RandomButton display={display} randomize={randomizeUnit} /> 
    {unit ? <ResetButton setUnit={setUnit} /> : null}
  </div>
}

const showUnits = (subUnits, currentUnit, setUnit) => {
  const classes = ["unit-selection"]
  return subUnits.map((unit,index) => {
    let tmpClasses = classes
    if( currentUnit?.name === unit.name){      
      tmpClasses = [...classes, "active-unit"]
    } else {
      tmpClasses = classes
    }

    return <div key={index} 
                onClick={() => setUnit(unit)} 
                className={tmpClasses.join(" ")} 
                style={inlineStyle(unit.img)}>
      <header><h1>{unit.name}</h1></header>
    </div>
  })
}

const Production = ({structure, path, units, unit, setUnit}) => {
  const [hidden, setHidden] = React.useState(true)
  const subUnits = units ? units.filter(unit => unit.structure === structure) : null;

  let display = hidden? <></> :
    <div className={"units-selector"}>{showUnits(subUnits, unit, setUnit)}</div>;

  if(!units) return null;

  return <div>
      <div className={"production-facility"} style={inlineStyle(path)} onClick={() => setHidden(!hidden)}>
        <header><h1>{camel2str(structure)}</h1></header>
      </div>

      <div>{display}</div>
  </div>
}

const Faction = ({data, units, unit, setUnit}) => {
  const [hidden, setHidden] = React.useState(true);

  return <div >
    
    <div onClick={() => setHidden(!hidden)}>
      <div>{}</div>
      <div style={{...inlineStyle(data.icon), height:"150px", 
  backgroundPosition: 'left',}} ></div>
      </div>
      {hidden ? null : 
      <div>
        {
          Object.entries(data.production).map(([structure, path]) => {
            return <Production 
                      key={structure} 
                      structure={structure} 
                      path={path}
                      units={units}
                      unit={unit}
                      setUnit={setUnit} />
          })
        }
      </div>
    }
    </div>
}

const FactionFlipper = ({ showFactions}) => {
  if(showFactions) {
    return "hide ⟰ units"
  } else {  
    return "show ⟱ units"
  }
}

const InputText = ({searchText, setSearchText}) => {
  return <input key={"inputter"} className={"unit-search"} 
  type={"search"} placeholder={"... unit name"} 
  onChange={(e) => setSearchText(e.target.value)} value={searchText}/>
}

const InputArea = ({units, currentUnit, setUnit, setSearchText, searchText, tags, setTags, showTags}) => {
  const Tag = ({tag, highlight}) => {
    const cns = ["tagged-attribute"]
    cns.push(highlight && tags.includes(tag) ? "used-tag" : "")
    return <div className={cns.join(" ")} key={tag} onClick={() => toggleTagging(tag)}>{tag}</div>;
  }
  
  const randomizeUnit = () => {
    const randomElement = (arr) => {
      return arr[Math.floor(Math.random()*arr.length)]
    }
    setUnit(randomElement(units))
  }

  const toggleTagging = (type) => {
    if(tags.includes(type)){
      setTags(tags.filter(item => item !== type))
    } else {
      setTags([...tags, type])
    }
  }
  return <div>
    <div className={"input-area"}>
      <InputText setSearchText={setSearchText} searchText={searchText}/>
      <ButtonGroup display={units} unit={currentUnit} setUnit={setUnit} randomizeUnit={randomizeUnit} />
    </div>
    <div className={"row search-by-tag"}>
      {tags.map(tag => <Tag key={tag} tag={tag} toggle={toggleTagging} />)}
      {tags.length > 0 ? <h1 className={"clear-tags"} onClick={() => setTags([])}>🚫</h1> : null}
      </div>
    <div>
      <Unit unit={currentUnit} setUnit={setUnit}>
        <div className={"attributes"}>
            {showTags && currentUnit?.types.map((( tag, index ) => {
                return <Tag key={tag} tag={tag} toggle={toggleTagging} highlight={true}/>
              }))}

              {showTags && currentUnit?
                !currentUnit.types.includes("Air") ? 
                  <button onClick={() => setUnit({...currentUnit, types:[...currentUnit.types, "Air"]})}>Take to the Air</button> :
                  !currentUnit.types.includes("Ground") ? 
                    <button onClick={() => setUnit({...currentUnit, types:[...currentUnit.types, "Ground"]})}>Bind to the Ground</button> :
                     null
                : null
              }
              
            </div>
      </Unit>
    </div>
  </div>
}

export const UnitSelector = (props) => {
  const [setUnit, currentUnit, units, showTags] = [props.setUnit, props.currentUnit, props.units, props.showTags]

  const [tags, setTags] = React.useState([])
  const [showFactions, setShowFactions] = React.useState(false)
  const [searchText, setSearchText] = React.useState("")

  let  followup; 
  if(units){
    const reset = <div className={"button column"} onClick={() => {setTags([]); setSearchText("")}}><div> Clear filters</div></div>;

    if(searchText.length > 0 || tags.length > 0){
      let subUnits = units.filter(unit => {
        let absent = false
        tags.forEach(tag => {
          if(!unit.types.includes(tag)){
            absent = true;
          }
        })
        return !absent
      }).filter(unit => unit.name.toLowerCase().includes(searchText.toLowerCase()))
      followup =  <>        
        {showUnits(subUnits, currentUnit, setUnit).length >0 ? <><h1 style={{fontSize: "2em"}}>Filtered Results:</h1>{showUnits(subUnits, currentUnit, setUnit)} </>: <></>}
        {reset}
      </>
    } else {
      followup = <>
        <div onClick={() => setShowFactions(!showFactions)} className={"selector"} style={{textAlign:"center", fontSize:"1.5em"}}><FactionFlipper showFactions={showFactions}/></div>
          {showFactions ? 
              Object.entries(factions).map( ([key, value]) => {
              return (
                <div key={key} className={"faction"}>
                  <Faction data={value} label={key} units={units} unit={currentUnit} setUnit={setUnit}/>
                </div>
              );
            }) : null
          }
      </>
    }
    return <>
      <InputArea showTags={showTags}
        units={units} currentUnit={currentUnit} setUnit={setUnit}
        setSearchText={setSearchText} searchText={searchText}
        tags={tags} setTags={setTags} />
        {props.children}
      {followup}
    </>
  } else {
    return "Loading"
  }
  
  
  
}