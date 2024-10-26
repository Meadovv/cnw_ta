import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const locationHelper = locationHelperBuilder({});

export const AdminIsAuthenticated = ({ children }) => {
    // const isLoggedIn = useSelector(state => state.admin.isLoggedIn);
    const isLoggedIn = true;
    return isLoggedIn ? children : <Navigate to="/login" />;
};

export const AdminIsNotAuthenticated = ({ children }) => {
    // const isLoggedIn = useSelector(state => state.admin.isLoggedIn);
    const isLoggedIn = false;
    return !isLoggedIn ? children : <Navigate to="/system/user-manage" />;
};