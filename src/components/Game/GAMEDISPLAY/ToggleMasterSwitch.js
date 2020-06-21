import React, { useContext } from 'react';
import '../../../styles.css';
import { MasterContext } from '../MasterContext';

const ToggleMasterSwitch = () => {
    const {
        master,
        toggleMasterControl,
    } = useContext(MasterContext)

    const masterCheck = () => {
        if (master) {
            return 'off'
        } else {
            return 'on'
        }
    }

    return (
        <div class='toggleMasterDiv'>
            <input type='checkbox' name='toggleSwitch' class='toggleMasterSwitch' checked={master} onChange={() => toggleMasterControl()} />
            <label class='toggleMasterLabel'> Toggle Dungeon Master {masterCheck()}</label>
        </div>
    )
}

export default ToggleMasterSwitch;