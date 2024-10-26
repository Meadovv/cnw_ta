import axios from '../axios';

const handleAddNewPost = (userID, content, img_url) => {
    return axios.post('/api/post/add', { userID: userID, content: content, img_url: img_url });
}

const getAllPostById = (inputId) => {
    return axios.get(`/api/get-all-posts?id=${inputId}`)
}

const getAllLikesOfPost = (inputId) => {
    return axios.get(`/api/post/get-all-likes?id=${inputId}`)
}
const handleLikePost = (userID, postID) => {
    return axios.post('/api/post/isliked', { userID: userID, postID: postID });
}
const editPost = (postID, content, user) => {
    return axios.put('/api/post/edit', { postID: postID, content: content, user: user });
}
const deletePost = (postID, user) => {
    return axios.delete('/api/post/delete', {
        data: { postID: postID, user: user }
    });
}
export { handleAddNewPost, getAllPostById, getAllLikesOfPost, handleLikePost, editPost, deletePost };