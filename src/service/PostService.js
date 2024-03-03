import axios from "axios";

export const createPost = async (data) => {
    const res = await axios.post(`http://localhost:3000/api/post/create`, data);
    return res.data;
}


export const getAllPost = async () => {
    const res = await axios.get(`http://localhost:3000/api/post/get-all`);
    return res.data;
}
export const likePost = async ({ id, userId }) => {

    const res = await axios.put(`http://localhost:3000/api/post/${id}/like`, { userId });
    return res.data;
}
export const likePost2 = async ({ id, userId }) => {
    const res = await axios.put(`http://localhost:3000/api/post/like-post/${id}`, { userId });
    return res.data;
}
export const unLikePost = async ({ id, userId }) => {

    const res = await axios.put(`http://localhost:3000/api/post/un-like/${id}`, { userId });
    return res.data;
}
export const getDetailPost = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/post/get-detail/${id}`);
    return res.data;
}

export const commentsPost = async ({ id, userId, comment }) => {
    const res = await axios.put(`http://localhost:3000/api/post/comments/${id}`, { userId, comment });
    return res.data;
}

export const deletePost = async (id, token) => {

    const res = await axios.delete(`http://localhost:3000/api/post/delete/${id}`, {
        headers: {
            token: ` Bearer ${token}`
        }
    });
    return res.data;
}

export const getPostByUser = async (userId) => {
    console.log(userId)
    const res = await axios.get(`http://localhost:3000/api/post/get-post-by-user/${userId}`);
    return res.data;
}
export const handleUploadMultiFiles = async (formData) => {
    console.log(formData)
    const res = await axios.post(`http://localhost:3000/api/post/upload-images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    );
    return res.data;
}