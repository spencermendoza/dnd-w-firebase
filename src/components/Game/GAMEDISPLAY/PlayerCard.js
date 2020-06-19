import React, { useContext } from 'react';
import { MasterContext } from '../MasterContext';
import '../../../styles.css';

const PlayerCard = ({
    player = {},
}) => {
    const { name, hp, armor, damage, initiative, active, id } = player;
    let activeDiv = '';
    let activeName = '';
    let activeInfoUl = '';
    let activeInfoItem = '';
    let activeInfoInfo = '';
    let activeEditButton = '';
    if (player.active === true) {
        activeDiv = 'activeDiv'
        activeName = 'activeName'
        activeInfoUl = 'activeInfoUl'
        activeInfoItem = 'activeInfoItem'
        activeInfoInfo = 'activeInfoInfo'
        activeEditButton = 'activeEditButton'
    } else {
        activeDiv = 'cardDiv'
        activeName = 'playerName'
        activeInfoUl = 'playerInfoUl'
        activeInfoItem = 'playerInfoItem'
        activeInfoInfo = 'playerInfoInfo'
        activeEditButton = 'editButton'

    }

    const {
        currentUser,
        handleEditClick,
        master,
    } = useContext(MasterContext);

    const showEdit = () => {
        if (master || currentUser === player.id) {
            return (
                <button onClick={() => handleEditClick(player)} id={activeEditButton}>Edit this player</button>
            )
        }
    }

    return (
        <div class={activeDiv}>
            <h1 class={activeName}>{name}'s attributes: </h1>
            <ul class={activeInfoUl}>
                <li class={activeInfoItem}>
                    <h3 class={activeInfoInfo}>Initiative: </h3>
                    <p class={activeInfoInfo}>{initiative}</p>
                </li>
                <li class={activeInfoItem}>
                    <h3 class={activeInfoInfo}>Hit Points: </h3>
                    <p class={activeInfoInfo}>{hp}</p>
                </li>
                <li class={activeInfoItem}>
                    <h3 class={activeInfoInfo}>Damage: </h3>
                    <p class={activeInfoInfo}>{damage}</p>
                </li>
                <li class={activeInfoItem}>
                    <h3 class={activeInfoInfo}>Armor Class: </h3>
                    <p class={activeInfoInfo}>{armor}</p>
                </li>
            </ul>
            {showEdit()}
        </div >
    )
}

export default PlayerCard;