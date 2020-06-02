import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../../styles.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
    <div id='navDiv'>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <ul id='navUl'>
        <li class='navLi'>
            <Link to={ROUTES.HOME} class='navLink'>Home</Link>
        </li>
        <li class='navLi'>
            <Link to={ROUTES.ACCOUNT} class='navLink'>Account</Link>
        </li>
        <li class='navLi'>
            <Link to={ROUTES.ADMIN} class='navLink'>Admin</Link>
        </li>
        <li class='navLi'>
            <SignOutButton />
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul id='navUl'>
        <li class='navLi'>
            <NavLink to={ROUTES.LANDING} class='navLink'>Landing</NavLink>
        </li>
        <li class='navLi'>
            <NavLink to={ROUTES.SIGN_IN} class='navLink'>Sign In</NavLink>
        </li>
    </ul>
);

export default Navigation;