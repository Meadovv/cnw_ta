import axios from '../axios'
const getAllVideos = (inputId) => {
    return axios.get(`/api/get-all-videos?id=${inputId}`)
}
const createNewVideoService = (data) => {
    return axios.post('/api/create-new-video', data)
}

const deleteVideoService = (videoId) => {
    return axios.delete('/api/delete-video', {
        data: { id: videoId }
    })
}

const editVideoService = (data) => {
    return axios.put('/api/edit-video', data)
}
export { getAllVideos, createNewVideoService, editVideoService, deleteVideoService }