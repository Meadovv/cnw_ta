import axios from '../axios'
const getAllLessons = (inputId) => {
    return axios.get(`/api/get-all-lessons?id=${inputId}`)
}
const createNewLessonService = (data) => {
    return axios.post('/api/create-new-lesson', data)
}

const deleteLessonService = (courseId) => {
    return axios.delete('/api/delete-lesson', {
        data: { id: courseId }
    })
}

const editLessonService = (data) => {
    return axios.put('/api/edit-lesson', data)
}
export { getAllLessons, createNewLessonService, editLessonService, deleteLessonService }