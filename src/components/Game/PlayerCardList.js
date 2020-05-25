import React, { useContext } from 'react';
import PlayerCard from './PlayerCard';
import { GameContext } from './context';

const PlayerCardList = () => {
    const {
        game,
        sortBy,
    } = useContext(GameContext);

    const playerCheck = () => {
        if (game.combatants.length > 0) {
            return (
                game.combatants.map(player => (
                    <PlayerCard
                        player={player}
                        key={player.id}
                    />
                )));
        } else {
            return (<><span>There are no players in this game! Add some players to get started!</span><hr /></>);
        }
    }

    return (
        <div>
            {playerCheck()}
        </div>
    )
}

export default PlayerCardList;