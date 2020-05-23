import React, { useContext } from 'react';
import PlayerCard from './PlayerCard';
import { GameContext } from './context';

const PlayerCardList = () => {
    const {
        players,
        sortBy,
    } = useContext(GameContext);

    return (
        <div>
            {players.map(player => (
                <PlayerCard
                    player={player}
                    key={player.id}
                />
            ))}
        </div>
    )
}

export default PlayerCardList;