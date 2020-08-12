import { Player } from './Player';

const cronan = Player.create({
    name: 'Cronan',
    hp: 158,
    damage: 52,
    initiative: 1,
    armor: 18,
    owner: '',
    id: '0',
    active: false,
    creature: false,
})

const balazar = Player.create({
    name: 'Balazar',
    hp: 127,
    damage: 32,
    initiative: 15,
    armor: 20,
    owner: '',
    id: '1',
    active: false,
    creature: false,
})

const marsk = Player.create({
    name: 'Marsk',
    hp: 114,
    damage: 75,
    initiative: 7,
    armor: 19,
    owner: '',
    id: '2',
    active: false,
    creature: false,
})

const barri = Player.create({
    name: 'Barri',
    hp: 69,
    damage: 12,
    initiative: 20,
    armor: 15,
    owner: '',
    id: '3',
    active: false,
    creature: false,
});


export const FAKE_PLAYERS = [
    cronan, balazar, marsk, barri
]