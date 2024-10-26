import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import '../../assets/css/app.scss';

const HeaderAdmin = ({ processLogout, adminInfo }) => {
    const [expandedMenu, setExpandedMenu] = useState({});

    const handleDropdownClick = (dropdowns, dropdown, index) => {
        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);
        const isShow = $('.nav-item.dropdown.show');
        const isShowIndex = Array.from(dropdowns).indexOf(isShow);
        const setting = $('.be-animate');
        const dropdownMenus = $$('.dropdown-menu');

        if (index !== 1) {
            if (isShowIndex === index) {
                isShow?.classList.remove('show');
                if (index === 0) dropdownMenus[0].classList.remove('show');
                if (index === 2) dropdownMenus[1].classList.remove('show');
                if (index === 3) dropdownMenus[2].classList.remove('show');
            } else {
                isShow?.classList.remove('show');
                if (index === 0) dropdownMenus[0].classList.add('show');
                if (index === 2) dropdownMenus[1].classList.add('show');
                if (index === 3) dropdownMenus[2].classList.add('show');
                dropdown.classList.add('show');
            }
        } else {
            const isShowSetting = $('.be-animate.open-right-sidebar');
            isShowSetting ? isShowSetting.classList.remove('open-right-sidebar') : setting.classList.add('open-right-sidebar');
        }
    };

    useEffect(() => {
        const $$ = document.querySelectorAll.bind(document);
        const dropdowns = $$('.nav-item.dropdown');
        dropdowns.forEach((dropdown, index) => {
            dropdown.addEventListener('click', () => handleDropdownClick(dropdowns, dropdown, index));
        });
        return () => {
            dropdowns.forEach(dropdown => {
                dropdown.removeEventListener('click', () => handleDropdownClick(dropdowns, dropdown));
            });
        };
    }, []);

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <nav className="navbar navbar-expand fixed-top be-top-header">
                <div className="container-fluid">
                    <div className="be-navbar-header">
                        <h2 className="navbar-brand"></h2>
                        <h3 style={{ marginLeft: "-70px", marginTop: "13px" }}>CodeCrush</h3>
                    </div>
                    <div className="page-title"><span>Dashboard</span></div>
                    <div className="be-right-navbar">
                        <ul className="nav navbar-nav float-right be-user-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" role="button" aria-expanded="false">
                                    <img src={`${process.env.PUBLIC_URL}/assets/img/avatar.png`} alt="Avatar" />
                                    <span className="user-name">Admin</span>
                                </a>
                                <div className="dropdown-menu" role="menu">
                                    <div className="user-info">
                                        <div className="user-name">Admin</div>
                                        <div className="user-position online">Available</div>
                                    </div>
                                    <a className="dropdown-item" href="#"><span className="fas fa-user"></span><span style={{ marginLeft: "10px" }}>Account</span></a>
                                    <a className="dropdown-item" href="#"><span className="fas fa-cog"></span><span style={{ marginLeft: "10px" }}>Settings</span></a>
                                    <a className="dropdown-item" href="#" onClick={processLogout}><span className="fas fa-sign-out-alt"></span><span style={{ marginLeft: "10px" }}>Logout</span></a>
                                </div>
                            </li>
                        </ul>
                        {/* Add remaining nav-items as in the original */}
                    </div>
                </div>
            </nav>
            {/* Right Sidebar */}
            <nav className="be-right-sidebar">
                {/* Sidebar Content */}
            </nav>
        </div>
    );
};

const mapStateToProps = state => ({
    isLoggedIn: state.admin.isLoggedIn,
    adminInfo: state.admin.adminInfo
});

const mapDispatchToProps = dispatch => ({
    processLogout: () => dispatch(actions.processLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderAdmin);
