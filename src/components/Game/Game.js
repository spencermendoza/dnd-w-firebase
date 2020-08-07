export class Game {
    constructor({
        lobbyNumber = 0,
        master = '',
        combatants = [],
        creatures = [],
        minutes = 2,
        seconds = 0,
        staged = [],
    }) {
        this.lobbyNumber = lobbyNumber;
        this.master = master;
        this.combatants = combatants;
        this.creatures = creatures;
        this.minutes = minutes;
        this.seconds = seconds;
        this.staged = staged;
    }

    static create(gameObj = {}) {
        return new Game(gameObj);
    }
}