import React, { useContext } from 'react';
import { GameContext } from './context';
import PlayerFormDialog from './PLAYER/playerFormDialog';
import '../../styles.css';

const PlayerCard = ({
    player = {},
}) => {
    const { name, hp, armor, damage, initiative, active } = player;
    let activeDiv = '';
    let activeEdit = '';
    if (player.active === true) {
        activeDiv = 'activeDiv'
        activeEdit = 'editButton';
    } else {
        activeDiv = 'cardDiv'
        activeEdit = 'editButton'
    }

    const {
        // handleTogglePlayerActive,
        handleEditClick,
    } = useContext(GameContext);

    return (
        <div class={activeDiv}>
            <h1 class='playerName'>{name}'s attributes: </h1>
            <ul class='playerInfoUl'>
                <li class='infoItem'>
                    <h3>Initiative: </h3>
                    <p>{initiative}</p>
                </li>
                <li class='infoItem'>
                    <h3>Hit Points: </h3>
                    <p>{hp}</p>
                </li>
                <li class='infoItem'>
                    <h3>Damage: </h3>
                    <p>{damage}</p>
                </li>
                <li class='infoItem'>
                    <h3>Armor Class: </h3>
                    <p>{armor}</p>
                </li>
            </ul>

            <button onClick={() => handleEditClick(player)} id={activeEdit}>Edit this player</button>
        </div>
    )
}

export default PlayerCard;