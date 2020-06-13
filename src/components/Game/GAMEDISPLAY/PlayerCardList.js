import React, { useContext } from 'react';
import PlayerCard from './PlayerCard';
import { MasterContext } from '../MasterContext';

const PlayerCardList = () => {
    const {
        game,
        sortBy,
        sortPlayersBy,
    } = useContext(MasterContext);

    const { combatants } = game;

    const playerCheck = () => {
        if (combatants.length > 0) {
            return (
                sortPlayersBy(combatants, sortBy).map(player => (
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