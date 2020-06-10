import { Player } from './Player';

const cronan = Player.create({
    name: 'Cronan',
    hp: 158,
    damage: 52,
    initiative: 1,
    armor: 18,
    owner: '',
    id: 'GbJ4KydcsuQ7oPGkPPejUXPruEC3',
    active: false
})

const balazar = Player.create({
    name: 'Balazar',
    hp: 127,
    damage: 32,
    initiative: 15,
    armor: 20,
    owner: '',
    id: 'XOwThCreVwOHAWefriYJDaeXv212',
    active: false,
})

const marsk = Player.create({
    name: 'Marsk',
    hp: 114,
    damage: 75,
    initiative: 7,
    armor: 19,
    owner: '',
    id: 'bVcIeXLtcWY5UtmtlezQ95upKvF3',
    active: false,
})

const barri = Player.create({
    name: 'Barri',
    hp: 69,
    damage: 12,
    initiative: 20,
    armor: 15,
    owner: '',
    id: 'hDwNrNpaJlW9M5EaLOOeS6AYDBF2',
    active: false,
});


export const FAKE_PLAYERS = [
    cronan, balazar, marsk, barri
]