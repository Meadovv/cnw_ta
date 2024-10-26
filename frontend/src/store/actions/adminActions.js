import actionTypes from './actionTypes';

export const addAdminSuccess = () => ({
    type: actionTypes.ADD_ADMIN_SUCCESS
})

export const adminLoginSuccess = (adminInfo) => ({
    type: actionTypes.ADMIN_LOGIN_SUCCESS,
    adminInfo: adminInfo
})

export const adminLoginFail = () => ({
    type: actionTypes.ADMIN_LOGIN_FAIL
})

// export const processLogout = () => ({
//     type: actionTypes.PROCESS_LOGOUT
// })