import axios from '../axios'
const getAllCourses = (inputId) => {
    return axios.get(`/api/get-all-courses?id=${inputId}`)
}
const createNewCourseService = (data) => {
    return axios.post('/api/create-new-course', data)
}

const deleteCourseService = (courseId) => {
    return axios.delete('/api/delete-course', {
        data: { id: courseId }
    })
}

const editCourseService = (data) => {
    return axios.put('/api/edit-course', data)
}
export { getAllCourses, createNewCourseService, editCourseService, deleteCourseService }