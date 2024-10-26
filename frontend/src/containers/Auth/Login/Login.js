import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as actions from "../../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../../services/userService';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Spinner from "react-bootstrap/Spinner";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOnChangeEmail = (event) => setEmail(event.target.value);
    const handleOnChangePassword = (event) => setPassword(event.target.value);
    const handleShowHidePassword = () => setIsShowPassword(!isShowPassword);
    
    const handleLogin = async () => {
        setErrMessage('');
        setIsLoading(true);

        try {
            let data = await handleLoginApi(email, password);
            if (data && data.errCode !== 0) {
                setErrMessage(data.message);
                toast.error(<div style={{ width: "300px", fontSize: "14px" }}><FontAwesomeIcon icon={faExclamationTriangle} /> Login failed!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            if (data && data.errCode === 0) {
                toast.success(<div style={{ width: "300px", fontSize: "14px" }}><i className="fas fa-check-circle"></i> Login success!</div>, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                if (data.user.role === true) {
                    dispatch(actions.adminLoginSuccess(data.user));
                } else {
                    dispatch(actions.userLoginSuccess(data.user));
                    navigate('/home');
                    window.location.reload();
                }
            }
            setIsLoading(false);
        } catch (e) {
            if (e.response && e.response.data) {
                setErrMessage(e.response.data.message);
            }
            setIsLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div className="login-page-container">
            <div className="main-login">
                <div className="brand d-flex">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/logo-symbol.png`} alt="Avatar" style={{ height: "50px" }} />
                    <h4 style={{ color: "blue", marginLeft: "10px" }}>C</h4><h4 style={{ color: "red" }}>-</h4>
                    <h4 style={{ color: "green" }}>C</h4><h4 style={{ color: "orange" }}>r</h4><h4 style={{ color: "blue" }}>u</h4><h4 style={{ color: "red" }}>s</h4><h4 style={{ color: "blue" }}>h</h4>
                </div>
                <h2 className="mt-4">Đăng nhập</h2>
                <div className="main__form mt-4">
                    <div className="main__form__children d-flex">
                        <form onSubmit={handleSubmit} className="form" id="form-1">
                            <div className="inputEmail">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    value={email}
                                    onChange={handleOnChangeEmail}
                                />
                            </div>
                            <div className="usePresentEmail">
                                <a href="#">Sử dụng địa chỉ email hiện tại của tôi</a>
                            </div>
                            <div className="inputPassword mt-3">
                                <input
                                    id="password"
                                    type={isShowPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Mật khẩu"
                                    className="form-control"
                                    value={password}
                                    onChange={handleOnChangePassword}
                                />
                            </div>
                            <div className="text-danger mt-2" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>{errMessage}</div>
                            <div className="showPassword d-flex mt-3">
                                <input
                                    type="checkbox"
                                    id="isShowPassword"
                                    name="isShowPassword"
                                    checked={isShowPassword}
                                    onChange={handleShowHidePassword}
                                />
                                <div className="textShow"> Hiện mật khẩu</div>
                            </div>
                            <div className="col-4 offset-8">
                                <Link to="/forgotpassword" className="btn-forgot" style={{ cursor: "pointer" }}>Forgot password</Link>
                            </div>
                            <div className="button-list mt-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {isLoading ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <button type="submit" className="btn-next" onClick={handleLogin}>Đăng nhập</button>
                                )}
                            </div>
                            <div className="mt-3" style={{ display: "flex", justifyContent: "center" }}>
                                <p>Không có tài khoản? <Link to="/signup" style={{ cursor: "pointer" }}>Đăng ký</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    lang: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
    userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    adminLoginSuccess: (adminInfor) => dispatch(actions.adminLoginSuccess(adminInfor)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
