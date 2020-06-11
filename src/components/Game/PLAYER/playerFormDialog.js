import React, { Component } from 'react';
import { Player } from './Player';
import { GameContext } from '../context';
import { withFirebase } from '../../Firebase';
import '../../../styles.css';

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
        const id = this.props.firebase.getUser();
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

    handleRemove = (player, removeFunc) => {

    }


    render() {
        const {
            playerDialog,
            handleDialogCancelClick,
            handleDialogConfirmClick,
            handleDialogRemoveClick,
        } = this.context;
        const { player, open } = playerDialog;

        if (!open) {
            return null;
        }

        return (
            <form id='formDialog'>
                <label class='formLabels'>Name: </label>
                <input
                    type='text'
                    ref={this.playerNameRef}
                    defaultValue={player.name}
                    placeholder='Name: '
                    class='formItems'
                />
                <label class='formLabels'>Initiative: </label>
                <input
                    type='number'
                    ref={this.playerInitiativeRef}
                    defaultValue={player.initiative}
                    placeholder='Initiative: '
                    class='formItems'
                />
                <label class='formLabels'>Hit Points: </label>
                <input
                    type='number'
                    ref={this.playerHpRef}
                    defaultValue={player.hp}
                    placeholder='HP: '
                    class='formItems'
                />
                <label class='formLabels'>Damage: </label>
                <input
                    type='number'
                    ref={this.playerDamageRef}
                    defaultValue={player.damage}
                    placeholder='Damage: '
                    class='formItems'
                />
                <label class='formLabels'>Armor Class: </label>
                <input
                    type='number'
                    ref={this.playerArmorRef}
                    defaultValue={player.armor}
                    placeholder='Armor Class: '
                    class='formItems'
                />
                <button onClick={e => this.handleSubmit(e, handleDialogConfirmClick, player)} class='formButtons'>Confirm</button>
                <button onClick={e => this.handleCancel(e, handleDialogCancelClick)} class='formButtons'>Cancel</button>
                <button onClick={e => handleDialogRemoveClick(player)} class='formButtons'>Remove</button>
            </form>
        )
    }
}

export default withFirebase(PlayerFormDialog);