class Arena {
  constructor(hero, monsters, size = 10) {
    this.hero = hero;
    this.monsters = monsters;
    this.size = size;
    this.message = "";
  }

  getDistance(fighter1, fighter2) {
    const dist = Math.sqrt(Math.pow(fighter2.x - fighter1.x, 2) + Math.pow(fighter2.y - fighter1.y, 2)).toFixed(2);
    return dist
  }

  isTouchable(attacker, defender) {
    const touch = this.getDistance(attacker, defender) <= attacker.getRange();
    return this.getDistance(attacker, defender) <= attacker.getRange()
  }

  move(direction) {
    let y = this.hero.y;
    let x = this.hero.x;
    if (direction === "N") this.hero.y -= 1;
    if (direction === "S") this.hero.y += 1;
    if (direction === "E") this.hero.x -= 1;
    if (direction === "W") this.hero.x += 1;

    if (!this.checkOnMap(this.hero.x, this.hero.y)) {
      this.message = "Movement outside the map is impossible";
    } else if (!this.CheckNoMonster(this.hero.x, this.hero.y)) {
      this.message = "Movement on a space already occupied impossible";
    } else {
      return { x, y };
    }

    document.getElementById('error').innerHTML = this.message;
    this.hero.x = x;
    this.hero.y = y;
    return this.hero;
  }

  checkOnMap(x, y) {
    return (x >= 0 && x < this.size) && (y >= 0 && y < this.size)
  }

  CheckNoMonster(x, y) {
    return !this.monsters.some(monster => (monster.isAlive() && monster.x === x && monster.y === y))
  }

  battle(monsterId) {

    const monstr = this.monsters[monsterId];

    if (!this.isTouchable(this.hero, monstr)) {
      this.message = "This monster is not touchable, please move first";
      showMessage();
      return false;
    }

    this.hero.fight(monstr);
    if (!monstr.isAlive()){
      if(this.checkBattle()) {
        this.message = `${this.hero.name} won 🗡️ ${this.hero.life} 💙 ${monstr.name} is dead !!!`
      } else {
        this.message = `${this.hero.name} won 🗡️ ${this.hero.life} 💙  All monsters are dead!`
      }
      
      showMessage();
      this.hero.updateExp(monstr);
      return true;
    } 

    if (this.isTouchable(monstr, this.hero)) {
      monstr.fight(this.hero);
      if (!this.hero.isAlive()) {
        this.message = `${monstr.name} won 🗡️ ${monstr.life} 💙 ${this.hero.name} is dead !!!`
        showMessage();
        monstr.updateExp(this.hero);
        return true;
      }
    }

    this.message = `${this.hero.name} 💙 ${this.hero.life} 🗡️ ${monstr.name} 💙 ${monstr.life}`
    showMessage();
    return false;

  }

  checkBattle(){
    return this.monsters.some(monster => monster.isAlive());
  }

  showMessage() {
    document.getElementById('error').innerHTML = this.message;
  }
}
