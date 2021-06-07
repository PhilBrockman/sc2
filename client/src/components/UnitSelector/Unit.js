import React from "react"
import "./Unit.css"

export const useUnits = (checkAgain) => {
  // console.log("beingcalled")
  const [response, setResponse] = React.useState(null)
  const [locked, setLocked] = React.useState(false)

  const apiURL = process.env.NODE_ENV ==="development"? 'http://localhost:5000/' : "https://sc2-meleee.herokuapp.com/";
  console.log('apiURL', apiURL)

  React.useEffect(() => {
    setLocked(true)
    const getUnits = async () =>{
      if(locked) {return []}
      const URL =apiURL + 'api/units';
      console.log('URL', URL)
        fetch(URL)
          .then(res => res.json())
          .then(res =>  {
            setResponse(res.units)
          })
          .catch(err => {
            console.error("error fetching", err)
          })
    }

    getUnits()
  }, [locked, apiURL])

  return [locked, response]
}

export const Unit = (props) => {
  const unit = props.unit;

  const unitCard = unit? <div className={"unit-card"}>
          <div className={"unit-name"}>{unit.name}</div>
          <div style={{display: "flex"}}>
            <div style={{minWidth:"200px", minHeight:"200px"}}><UnitImg unit={unit} /></div>
            <div className={"attributes"}>
            {props.children}
            </div>
          </div>
        </div>  
      : null;
  
  return <>{unitCard}</>
      
}


export const inlineStyle = (img) => {
  return {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
    backgroundImage: `url(${ img})`,
    minWidth: '50px',
  }
}
export const UnitImg = ({unit, label}) => {
  return <div style={inlineStyle(unit.img)} className={"unit-img"}>
    <div className={"unit-img-label"}><h1>{label}</h1></div>
  </div>
}


