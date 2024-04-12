import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import s from './Header.module.scss';
import logo from '../../images/logo.svg';
import search from '../../images/search.svg';
import hum from '../../images/hum.svg';
import {useAuth} from "../../AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/auth');
    };
    return (
        <header className={s.header}>
            <Link to='/' className="logo">
                <img src={logo} alt="greenman.kz"/>
                <span>CoList</span>
            </Link>
            <div className={s.right}>
                <div className={s.search}>
                    <img src={search} alt=""/>
                </div>
                <div className="profile__img" onClick={handleLogout}>
                    <img src={hum} alt=""/>
                </div>
            </div>
        </header>
    )
}

export default Header;
