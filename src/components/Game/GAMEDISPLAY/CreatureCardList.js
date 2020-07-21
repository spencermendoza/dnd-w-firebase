import React, { useContext } from 'react';
import PlayerCard from './PlayerCard';
import { MasterContext } from '../MasterContext';
import '../../../styles.css';

const CreatureCardList = () => {
    const {
        game,
    } = useContext(MasterContext);

    return (
        <div></div>
    )
}

export default CreatureCardList;