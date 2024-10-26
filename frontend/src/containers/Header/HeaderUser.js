import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import './HeaderAdmin.scss';

const HeaderUser = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);

    const handleLogout = () => {
        dispatch(actions.processLogout());
    };

    return (
        <div className="header-container">
            {/* Thanh navigator */}
            <div className="header-tabs-container">
                <Navigator menus={adminMenu} />
            </div>

            {/* Lời chào người dùng */}
            {userInfo && userInfo.fullName ? <div>Xin chào {userInfo.fullName}</div> : null}

            {/* Nút logout */}
            <div className="btn btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
            </div>
        </div>
    );
};

export default HeaderUser;
