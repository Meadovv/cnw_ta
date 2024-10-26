import axios from '../axios'
const getAllUsersEnrollment = (inputId) => {
    return axios.get(`/api/get-all-usersRegisterCourse?id=${inputId}`)
}
const enrrollmentCourse = (courseID, userID) => {
    return axios.post('/api/course/register', { courseID: courseID, userID: userID })
}
export { getAllUsersEnrollment, enrrollmentCourse }