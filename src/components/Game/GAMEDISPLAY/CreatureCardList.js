import React, { useContext } from 'react';
import PlayerCard from './PlayerCard';
import { MasterContext } from '../MasterContext';
import '../../../styles.css';

const CreatureCardList = () => {
    const {
        game,
    } = useContext(MasterContext);

    const { creatures } = game;

    const creatureCheck = () => {
        if (creatures.length > 0) {
            return (
                <div class='testCardListDiv'>
                    {creatures.map(creature => (
                        <PlayerCard
                            player={creature}
                            key={creature.id}
                        />
                    ))}
                </div>
            );
        } else {
            console.log(game.creatures)
            return (<><span>There are no creatures in this game! Add some creatures for your players to challenge!</span><hr /></>);
        }
    }

    return (
        <div>
            {creatureCheck()}
        </div>
    )
}

export default CreatureCardList;