import React, { useContext, useState } from 'react';
import { GameContext } from '../context';

const PlayerSortMenu = () => {
    const { sortOptions, handleSortMenuChange } = useContext(GameContext);
    const [openMenu, setOpenMenu] = useState(false);

    const sortSelection = (selection) => {
        setOpenMenu(false);
        handleSortMenuChange(selection);
    }

    if (openMenu === false) {
        return (
            <button onClick={() => setOpenMenu(!openMenu)}>Open Player Sort Options</button>
        )
    }

    return (
        <ul>
            {sortOptions.map(p => (
                <li>
                    <PlayerSortOptions
                        sortOption={p}
                        selection={sortSelection}
                        key={p.sortBy}
                    />
                </li>
            ))}
        </ul>
    )
}

/////////////////////COMPONENT////////////////////////////////

const PlayerSortOptions = ({ sortOption, selection }) => {
    return (
        <button onClick={() => selection(sortOption.sortBy)}>{sortOption.displayText}</button>
    );
}

export default PlayerSortMenu;