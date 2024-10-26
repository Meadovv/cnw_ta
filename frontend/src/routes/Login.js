import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as actions from "../store/actions";
import { KeyCodeUtils, LanguageUtils } from "../utils";
import userIcon from '../../src/assets/images/user.svg';
import passIcon from '../../src/assets/images/pass.svg';
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import adminService from '../services/adminService';

const Login = ({ lang }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const btnLogin = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const refresh = () => {
        setUsername('');
        setPassword('');
        setLoginError('');
    };

    const onUsernameChange = (e) => setUsername(e.target.value);
    const onPasswordChange = (e) => setPassword(e.target.value);

    const redirectToSystemPage = () => {
        const redirectPath = '/system/user-manage';
        navigate(redirectPath);
    };

    const processLogin = async () => {
        let loginBody = {
            username: 'admin',
            password: '123456'
        };
        const adminInfo = {
            "tlid": "0",
            "tlfullname": "Administrator",
            "custype": "A",
            "accessToken": "eyJhbGciOiJIU"
        };

        dispatch(actions.adminLoginSuccess(adminInfo));
        refresh();
        redirectToSystemPage();

        try {
            await adminService.login(loginBody);
        } catch (e) {
            console.error('Error during login:', e);
        }
    };

    const handlerKeyDown = (event) => {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCodeUtils.ENTER) {
            event.preventDefault();
            if (btnLogin.current && !btnLogin.current.disabled) {
                btnLogin.current.click();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handlerKeyDown);
        return () => {
            document.removeEventListener('keydown', handlerKeyDown);
        };
    }, []);

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="form_login">
                    <h2 className="title">
                        <FormattedMessage id="login.login" />
                    </h2>
                    <div className="form-group icon-true">
                        <img className="icon" src={userIcon} alt="User Icon" />
                        <input
                            placeholder={LanguageUtils.getMessageByKey("login.username", lang)}
                            id="username"
                            name="username"
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={onUsernameChange}
                        />
                    </div>

                    <div className="form-group icon-true">
                        <img className="icon" src={passIcon} alt="Password Icon" />
                        <input
                            placeholder={LanguageUtils.getMessageByKey("login.password", lang)}
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={onPasswordChange}
                        />
                    </div>

                    {loginError && (
                        <div className="login-error">
                            <span className="login-error-message">{loginError}</span>
                        </div>
                    )}

                    <div className="form-group login">
                        <input
                            ref={btnLogin}
                            id="btnLogin"
                            type="submit"
                            className="btn"
                            value={LanguageUtils.getMessageByKey("login.login", lang)}
                            onClick={processLogin}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    lang: state.app.language,
});

export default connect(mapStateToProps)(Login);
