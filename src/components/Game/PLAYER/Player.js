export class Player {
    constructor({
        name = '',
        hp = 0,
        damage = 0,
        initiative = 0,
        armor = 0,
        id = 0,
        control = '',
        active = Boolean,
        creature = Boolean,
    }) {
        this.name = name;
        this.hp = hp;
        this.damage = damage;
        this.initiative = initiative;
        this.armor = armor;
        this.id = id;
        this.control = control;
        this.active = active;
        this.creature = creature;
    }

    static create(playerObj = {}) {
        return new Player(playerObj);
    }
}






