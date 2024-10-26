import axios from '../axios';
const handleAddNewComment = (userID, content, postID) => {
    return axios.post('/api/comment/add', { userID: userID, content: content, postID: postID });
}

const getAllCommentById = (inputId) => {
    return axios.get(`/api/get-all-comments?id=${inputId}`)
}

const getAllLikesOfComment = (inputId) => {
    return axios.get(`/api/comment/get-all-likes?id=${inputId}`)
}
const handleLikeComment = (userID, commentID) => {
    return axios.post('/api/comment/isliked', { userID: userID, commentID: commentID });
}
const handleEditComment = (commentID, content, user) => {
    return axios.put('/api/comment/edit', { commentID: commentID, content: content, user: user });
}
const handleDeleteComment = (commentID, user) => {
    return axios.delete('/api/comment/delete', {
        data: { commentID: commentID, user: user }
    });
}

export { handleAddNewComment, getAllCommentById, getAllLikesOfComment, handleLikeComment, handleEditComment, handleDeleteComment };