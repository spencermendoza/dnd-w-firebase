export class Game {
    constructor({
        lobbyNumber = 0,
        master = '',
        combatants = [],
    }) {
        this.lobbyNumber = lobbyNumber;
        this.master = master;
        this.combatants = combatants;
    }

    static create(gameObj = {}) {
        return new Game(gameObj);
    }
}