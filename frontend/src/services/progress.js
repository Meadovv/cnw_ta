import axios from '../axios'
const getProgressOfCourse = (inputId, name) => {
    return axios.get(`/api/progress/get-progress-course?id=${inputId}&name=${name}`)
}
const createProgressOfCourse = (courseID, userID, videoID, completionPercent) => {
    return axios.post('/api/progress/create-progress-course',
        { courseID: courseID, userID: userID, videoID: videoID, completionPercent: completionPercent })
}
export { getProgressOfCourse, createProgressOfCourse }