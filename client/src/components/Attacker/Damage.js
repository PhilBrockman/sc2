export const groundAirTargetingValidation = (attack, defender) => {
 return intersection(intersection(attack.targets, defender.types), ["Ground", "Air"])
}

function intersection(a, b) {
  var setA = new Set(a);
  var setB = new Set(b);
  var intersection = new Set([...setA].filter(x => setB.has(x)));
  return Array.from(intersection);
}


export const canAttackTargetDefender = (attack, defender) => {
  if(attack && defender){
    const overlap = intersection(intersection(attack.targets, defender.types), ["Ground", "Air"]);
    return overlap.length > 0
  } else {
    return false
  }
}
// d = Damage(unit, defender, attack, attackResearch, armorResearch, shieldsResearch)
// Damage.oneStep(unit, defender)
export class Damage{
  constructor( attacker, defender, attackIndex, research, guardian=0) {
    if(!attacker || !defender){return null}

  const [attackResearch, shieldsResearch, armorResearch] = research
  this.research = {
    attack: attackResearch,
    armor: armorResearch,
    shields: shieldsResearch
  }

  this.att = JSON.parse(JSON.stringify(attacker));
  this.def = JSON.parse(JSON.stringify(defender));
  this.attackIndex = attackIndex

  let Spell = 1
  let Hallucinated = 1
  let Corrupted = 1
  let Hardened = 900
  let Prismatic = 1

  this.bonusDamage = () => {
    return this.att.attacks[this.attackIndex].bonuses.filter(bonus => this.def.types.includes(bonus.to)).reduce((total, amount) => {
      return total+amount.baseDamage+amount.researchBonus*this.research.attack
    }, 0)
  }

  this.damageDealt = () => {
    const attack = this.att?.attacks[this.attackIndex]
    if(this.att && this.def && attack){
      return (
        attack.baseDamage +
        this.research.attack*attack.researchBonus +
        this.bonusDamage()
      )  
    } else {
      return "";
    }
  }

  this.armorDefense = () => {
    return this.def.base.armor + this.research.armor
  }

  this.defenseAvailable = () => {
    if(this.def.base?.shields > 0){
      return this.research.shields
    } else {
      return this.armorDefense(this.def)
    }
  }

  this.defenseApplied = () => {
    return this.defenseAvailable()*Spell*(2-Hallucinated)
  }

this.damageReceived = () => {
    return this.damageDealt()*Corrupted*Hallucinated*Prismatic - this.defenseApplied();
  }


  this.damageCapped = (att, def) => {
    return Math.min(
      this.damageReceived(att, def),
      Hardened*Corrupted*Hallucinated+900*(1-Spell)
    );
  }

  this.damageInflicted = (att, def) => {
    return Math.max(
      .5,
      this.damageCapped(att, def) - guardian
    );
  }


}

totalDamage = () => {
  const def = this.def
  const att = this.att

  if(def.base.shields > 0 && this.damageInflicted(att, def) > def.base.shields + this.armorDefense(def)){
    return this.damageInflicted(att, def)-this.armorDefense(def)
  } else {
    return this.damageInflicted(att, def)
  }
}


eliminate = () => {
  let newValues = this.oneShot();
  if(!newValues){return 0}
  let count = 1;
  while(newValues?.health > 0){
    count++;

      if(newValues){
        const defender = {
          ...this.def,
          base: {
            ...this.def.base,
            health: newValues.health,
            shields: newValues.shields,
          }
        }
        const d =  new Damage(this.att,
          JSON.parse(JSON.stringify(defender)), this.attackIndex, 
          [ this.research.attack, this.research.shields, this.research.armor])
        newValues= d.oneShot()
      }
      
    }
    return count;
}


oneShot = (faked=true) => {
  let att; let def;
  if(faked){
    att = JSON.parse(JSON.stringify(this.att));
    def = JSON.parse(JSON.stringify(this.def));
  } else {
    att = this.att
    def = this.def
  }

  let results = null
  let log

  if(att?.attacks[this.attackIndex] === undefined || !def){
    return "👀 no attacker or attack not found"
  } if(!canAttackTargetDefender(att.attacks[this.attackIndex], def)){
    return "can't shoot"
  }
  if(def.base.health > 0){
    let damageSum=0;

    for(var i = 0; i < att.attacks[this.attackIndex].repeats; i++){
      const d =  new Damage(att,
        JSON.parse(JSON.stringify(def)), this.attackIndex, 
        [ this.research.attack, this.research.shields, this.research.armor])
      let damage = d.totalDamage();
      if(def.base?.shields > 0){
        if(damage <= def.base.shields){
          def.base.shields -= damage
          log = `${damage} to shields. (${def.base.shields} remaining)`
        } else {
          def.base.shields = 0;
          def.base.health -= damage - def.base.shields;
          log = `${damage} has overloaded shields. (${def.base.health} health remaining)`
        }
      } else {
        def.base.health -= damage;
        log = `${damage} damage. (${def.base.health} HP)`
      }
      damageSum += damage;
      if(def.base.health < 0){
        const overkill = (100*-def.base.health/damageSum).toFixed(1)
        log += ` (${overkill}% attack wasted)`
      }
      results = ({health: def.base.health, shields: def.base.shields, totalDamage: damageSum, log: log})
    }
  }

  return results
}
}
