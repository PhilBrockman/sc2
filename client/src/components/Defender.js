import React from 'react'
import {Unit} from "./UnitSelector/Unit"
import {UnitSelector} from "./UnitSelector/UnitSelector"

export const Defender = ({unit, setUnit, units}) => {
    return <UnitSelector setUnit={setUnit} currentUnit={unit} units={units}>
    </UnitSelector>
  }
        
