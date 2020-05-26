import React, { useContext } from 'react';
import { GameContext } from './context';
import PlayerFormDialog from './PLAYER/playerFormDialog';

const PlayerCard = ({
    player = {},
}) => {
    const { name, hp, armor, damage, initiative } = player;
    // let isActive = '';

    const {
        // handleTogglePlayerActive,
        handleEditClick,
    } = useContext(GameContext);

    return (
        <div>
            <h1>{name}'s attributes: </h1>
            <ul>
                <li>
                    <h3>Initiative: </h3>
                    <p>{initiative}</p>
                </li>
                <li>
                    <h3>Hit Points: </h3>
                    <p>{hp}</p>
                </li>
                <li>
                    <h3>Damage: </h3>
                    <p>{damage}</p>
                </li>
                <li>
                    <h3>Armor Class: </h3>
                    <p>{armor}</p>
                </li>
            </ul>

            <button onClick={() => handleEditClick(player)}>Edit this player</button>
        </div>
    )
}

export default PlayerCard;