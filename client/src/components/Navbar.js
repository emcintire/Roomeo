import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {FaBars, FaTimes, FaBed} from 'react-icons/fa'
import { MdArrowDropDown } from 'react-icons/md';
import './Navbar.css'; 
import { Button } from './Button';
import { IconContext } from 'react-icons/lib'
import Dropdown from './Dropdown';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [dropdown, setDropdown] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if(window.innerWidth <= 960){
            setButton(false)
        } else{
            setButton(true)
        }
    };

    const onMouseEnter = () => {
        if(window.innerWidth <= 960){
            setDropdown(false)
        } else{
            setDropdown(true)
        }
    };

    const onMouseLeave = () => {
        if(window.innerWidth <= 960){
            setDropdown(false)
        } else{
            setDropdown(false)
        }
    };

    useEffect(() => {
        showButton()
    }, []);

    window.addEventListener('resize', showButton);

    return (
        <>
        <IconContext.Provider value={{color: 'white'}}>
            <div className='navbar'>
                <div className='navbar-container container'>
                    <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
                        <FaBed className='navbar-icon' />
                         ROOMEO 
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        {click ? <FaTimes /> : <FaBars />}
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/about-us' className='nav-links' onClick={closeMobileMenu}>
                                About Us
                            </Link>
                        </li>
                        <li className='nav-item'
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        >
                            <Link to='/profile' className='nav-links' onClick={closeMobileMenu}>
                                Profile < MdArrowDropDown />
                            </Link>
                            {dropdown && <Dropdown />}
                        </li>
                        <li className='nav-btn'>
                            {button ? (
                                <Link to='/sign-in' className='btn-link'>
                                    <Button buttonStyle='btn--outline'>
                                        SIGN IN
                                    </Button>
                                </Link>
                            ) : (
                                <Link to='/sign-in' className='btn-link' onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline' buttonSize='btn--mobile'>
                                        SIGN IN
                                    </Button>
                                </Link>
                            )}
                        </li>
                        <li className='nav-btn'>
                            {button ? (
                                <Link to='/sign-up' className='btn-link'>
                                    <Button buttonStyle='btn--outline'>
                                        SIGN UP
                                    </Button>
                                </Link>
                            ) : (
                                <Link to='/sign-up' className='btn-link' onClick={closeMobileMenu}>
                                    <Button buttonStyle='btn--outline' buttonSize='btn--mobile'>
                                        SIGN UP
                                    </Button>
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
 
            </div>
        </IconContext.Provider>
        </>
    );
}

export default Navbar
