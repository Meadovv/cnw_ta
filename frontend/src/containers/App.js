import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AdminIsAuthenticated, AdminIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils';
import Login from './Auth/Login/Login';
import SignUp from './Auth/SignUp/signup';
import ChangePassword from './Auth/ChangePassword/changePassword';
import ForgotPassword from './Auth/ForgotPassword/ForgotPassword';
import System from '../routes/System';
import HomePage from './System/home/HomePage';
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import Learn from './Auth/Learn';
import './style.scss';
import SystemOfUser from '../routes/SystemOfUser';

const App = (props) => {
    const [bootstrapped, setBootstrapped] = useState(false);

    useEffect(() => {
        const handlePersistorState = () => {
            const { persistor, onBeforeLift } = props;
            let { bootstrapped } = persistor.getState();
            if (bootstrapped) {
                if (onBeforeLift) {
                    Promise.resolve(onBeforeLift())
                        .then(() => setBootstrapped(true))
                        .catch(() => setBootstrapped(true));
                } else {
                    setBootstrapped(true);
                }
            }
        };
        handlePersistorState();
    }, [props]);

    if (!bootstrapped) {
        return null; // Hoặc một component loading nếu cần
    }

    return (
        <BrowserRouter>
            <div className="main-container">
                <ConfirmModal />
                <span className="content-container">
                    <Routes>
                        <Route path={path.HOME} element={<HomePage />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/changepassword" element={<ChangePassword />} />
                        <Route path="/learn/:id" element={<Learn />} />
                        <Route path={path.LOGIN} element={<AdminIsNotAuthenticated><Login /></AdminIsNotAuthenticated>} />
                        <Route path="/system/*" element={<AdminIsAuthenticated><System /></AdminIsAuthenticated>} />
                        <Route path="/" element={<SystemOfUser />} />
                        <Route path="*" element={<Navigate to={path.HOME} replace />} />
                    </Routes>
                </span>
                <ToastContainer
                    className="toast-container"
                    toastClassName="toast-item"
                    bodyClassName="toast-item-body"
                    autoClose={false}
                    hideProgressBar={true}
                    pauseOnHover={false}
                    pauseOnFocusLoss={true}
                    closeOnClick={false}
                    draggable={false}
                    closeButton={<CustomToastCloseButton />}
                />
            </div>
        </BrowserRouter>
    );
};

const mapStateToProps = (state) => ({
    started: state.app.started,
    adminIsLoggedIn: state.admin.isLoggedIn,
});

export default connect(mapStateToProps)(App);
