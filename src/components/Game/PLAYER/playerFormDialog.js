import React, { Component } from 'react';
import { Player } from './Player';
import { GameContext } from '../context';
import { withFirebase } from '../../Firebase';

class PlayerFormDialog extends Component {
    constructor(props) {
        super(props)

        this.playerNameRef = React.createRef();
        this.playerInitiativeRef = React.createRef();
        this.playerHpRef = React.createRef();
        this.playerArmorRef = React.createRef();
        this.playerDamageRef = React.createRef();
        this.playerIdRef = React.createRef();
    }

    static contextType = GameContext;

    handleCancel = (e, onCancel) => {
        e.preventDefault();
        onCancel();
    };

    handleSubmit = (e, onConfirm, player) => {
        e.preventDefault();
        const id = Math.floor(Math.random() * 100000);
        const newPlayer = Player.create({
            name: this.playerNameRef.current.value,
            hp: parseInt(this.playerHpRef.current.value),
            damage: parseInt(this.playerDamageRef.current.value),
            initiative: parseInt(this.playerInitiativeRef.current.value),
            armor: parseInt(this.playerArmorRef.current.value),
            owner: '',
            id: player.id ? player.id : id,
            active: false,
        });
        onConfirm(newPlayer);
    }


    render() {
        const {
            playerDialog,
            handleDialogCancelClick,
            handleDialogConfirmClick,
        } = this.context;
        const { player, open } = playerDialog;

        if (!open) {
            return null;
        }

        return (
            <form>
                <label>Name: </label>
                <input
                    type='text'
                    ref={this.playerNameRef}
                    defaultValue={player.name}
                    placeholder='Name: '
                />
                <label>Initiative: </label>
                <input
                    type='number'
                    ref={this.playerInitiativeRef}
                    defaultValue={player.initiative}
                    placeholder='Initiative: '
                />
                <label>Hit Points: </label>
                <input
                    type='number'
                    ref={this.playerHpRef}
                    defaultValue={player.hp}
                    placeholder='HP: '
                />
                <label>Damage: </label>
                <input
                    type='number'
                    ref={this.playerDamageRef}
                    defaultValue={player.damage}
                    placeholder='Damage: '
                />
                <label>Armor Class: </label>
                <input
                    type='number'
                    ref={this.playerArmorRef}
                    defaultValue={player.armor}
                    placeholder='Armor Class: '
                />
                <button onClick={e => this.handleSubmit(e, handleDialogConfirmClick, player)}>Confirm</button>
                <button onClick={e => this.handleCancel(e, handleDialogCancelClick)}>Cancel</button>
            </form>
        )
    }
}

export default withFirebase(PlayerFormDialog);