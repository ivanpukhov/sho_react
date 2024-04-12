import React from 'react';
import {Link} from "react-router-dom";


const Auth = () => {

    return (
        <div className="cart__n">
            <div className="cart__null">
                <div className="cart__null-title">
                    Нужна авторизация!
                </div>
                <div className="cart__null-text">
                    Войдите в личный кабинет или зарегистрируйтесь на нашем сервисе
                </div>
                <Link to={'/login'} className="cart__null--btn">Вход</Link>
                <Link to={'/register'} className="cart__null--btn">Регистрация</Link>
            </div>
        </div>
    );
};

export default Auth;
