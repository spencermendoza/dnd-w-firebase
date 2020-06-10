export class Game {
    constructor({
        lobbyNumber = 0,
        master = '',
        combatants = [],
        minutes = 2,
        seconds = 0,
    }) {
        this.lobbyNumber = lobbyNumber;
        this.master = master;
        this.combatants = combatants;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    static create(gameObj = {}) {
        return new Game(gameObj);
    }
}