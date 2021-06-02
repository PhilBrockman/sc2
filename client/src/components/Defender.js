import React from 'react'
import {UnitSelector} from "./UnitSelector/UnitSelector"

export const Defender = ({unit, setUnit, units}) => {
    return <UnitSelector setUnit={setUnit} currentUnit={unit} units={units} showTags={true}>
    </UnitSelector>
  }
        
