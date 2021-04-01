import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { MenuItems } from './MenuItems';
import './Dropdown.css';

function Dropdown() {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    return (
        <>
            <ul
                onClick={handleClick}
                className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}
            >
                {/* {MenuItems.map((item, index) => {
                return(
                    <li key={index}>
                        <Link className={item.cName} to={item.path} onClick={() => setClick(false)}>
                            {item.title}
                        </Link>
                    </li>
                )
            })} */}
                <li>
                    <Link
                        className="dropdown-link"
                        to="/UserProfile"
                        onClick={() => setClick(false)}
                    >
                        Edit profile
                    </Link>
                </li>
                <li>
                    <Link
                        className="dropdown-link"
                        to="/UserAccount"
                        onClick={() => setClick(false)}
                    >
                        Account Settings
                    </Link>
                </li>
                <li>
                    <Link
                        className="dropdown-link"
                        to="/"
                        onClick={() => {
                            window.localStorage.removeItem('token');
                            setClick(false);
                        }}
                    >
                        Sign out
                    </Link>
                </li>
            </ul>
        </>
    );
}

export default Dropdown;
