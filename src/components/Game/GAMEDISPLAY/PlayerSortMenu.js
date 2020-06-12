import React, { useContext, useState } from 'react';
import '../../../styles.css';
import { MasterContext } from '../MasterContext';

const PlayerSortMenu = () => {
    const { sortOptions, handleSortMenuChange } = useContext(MasterContext);
    const [openMenu, setOpenMenu] = useState(false);

    const sortSelection = (selection) => {
        setOpenMenu(false);
        handleSortMenuChange(selection);
    }

    if (openMenu === false) {
        return (
            <button onClick={() => setOpenMenu(!openMenu)} id='sortButton'>Open Player Sort Options</button>
        )
    }

    return (
        <ul id='sortUl'>
            {sortOptions.map(p => (
                <li id='sortOptions'>
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