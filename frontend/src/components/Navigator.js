import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Navigator.scss';

const MenuGroup = ({ name, children }) => (
    <li className="menu-group">
        <div className="menu-group-name">
            <FormattedMessage id={name} />
        </div>
        <ul className="menu-list list-unstyled">
            {children}
        </ul>
    </li>
);

const Menu = ({ name, active, link, children, onClick, hasSubMenu, onLinkClick }) => (
    <li className={`menu${hasSubMenu ? " has-sub-menu" : ""}${active ? " active" : ""}`}>
        {hasSubMenu ? (
            <>
                <span
                    className="menu-link collapsed"
                    onClick={onClick}
                    aria-expanded="false"
                >
                    <FormattedMessage id={name} />
                    <div className="icon-right">
                        <i className="far fa-angle-right" />
                    </div>
                </span>
                <div>
                    <ul className="sub-menu-list list-unstyled">
                        {children}
                    </ul>
                </div>
            </>
        ) : (
            <Link to={link} className="menu-link" onClick={onLinkClick}>
                <FormattedMessage id={name} />
            </Link>
        )}
    </li>
);

const SubMenu = ({ name, link, onLinkClick }) => {
    const location = useLocation();

    const getItemClass = (path) => {
        console.log(location);
        return location.pathname === path ? "active" : "";
    };

    return (
        <li className={`sub-menu ${getItemClass(link)}`}>
            <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
                <FormattedMessage id={name} />
            </Link>
        </li>
    );
};

const Navigator = ({ menus, onLinkClick }) => {
    const [expandedMenu, setExpandedMenu] = useState({});
    const location = useLocation();

    useEffect(() => {
        checkActiveMenu();
    }, [location]);

    const toggle = (groupIndex, menuIndex) => {
        const expandedMenuCopy = {};
        const needExpand = !(expandedMenu[groupIndex + '_' + menuIndex] === true);
        if (needExpand) {
            expandedMenuCopy[groupIndex + '_' + menuIndex] = true;
        }
        setExpandedMenu(expandedMenuCopy);
    };

    const isMenuHasSubMenuActive = (subMenus, link) => {
        if (subMenus && subMenus.length > 0) {
            return subMenus.some((subMenu) => subMenu.link === location.pathname);
        }
        return link && location.pathname === link;
    };

    const checkActiveMenu = () => {
        outerLoop:
        for (let i = 0; i < menus.length; i++) {
            const group = menus[i];
            if (group.menus && group.menus.length > 0) {
                for (let j = 0; j < group.menus.length; j++) {
                    const menu = group.menus[j];
                    if (menu.subMenus && menu.subMenus.length > 0) {
                        if (isMenuHasSubMenuActive(menu.subMenus, null)) {
                            const key = i + '_' + j;
                            setExpandedMenu({ [key]: true });
                            break outerLoop;
                        }
                    }
                }
            }
        }
    };

    return (
        <ul className="navigator-menu list-unstyled">
            {menus.map((group, groupIndex) => (
                <MenuGroup key={groupIndex} name={group.name}>
                    {group.menus && group.menus.map((menu, menuIndex) => {
                        const isActive = isMenuHasSubMenuActive(menu.subMenus, menu.link);
                        const isOpen = expandedMenu[groupIndex + '_' + menuIndex];
                        return (
                            <Menu
                                key={menuIndex}
                                active={isActive}
                                name={menu.name}
                                link={menu.link}
                                hasSubMenu={menu.subMenus}
                                onClick={() => toggle(groupIndex, menuIndex)}
                                onLinkClick={onLinkClick}
                            >
                                {menu.subMenus && isOpen && menu.subMenus.map((subMenu, subMenuIndex) => (
                                    <SubMenu
                                        key={subMenuIndex}
                                        name={subMenu.name}
                                        link={subMenu.link}
                                        onLinkClick={onLinkClick}
                                    />
                                ))}
                            </Menu>
                        );
                    })}
                </MenuGroup>
            ))}
        </ul>
    );
};

export default Navigator;
