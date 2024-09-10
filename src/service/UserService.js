import axios from 'axios'
export const axiosJWT = axios.create()
const baseUrl =process.env.REACT_APP_LOCAL_HOST
export const loginUser = async (data) => {
    const res = await axios.post(`${baseUrl}/user/login`, data);
    return res.data;
}
export const logOut = async () => {
    const res = await axios.post(`${baseUrl}/user/log-out`);
    return res.data;
}
export const registerUser = async (email, fullName, userName, password, confirmPassword) => {
    const res = await axios.post(`${baseUrl}/user/create`, { email, password, userName, fullName, confirmPassword });
    return res.data;
}
export const updateUser = async (id, data) => {
    const res = await axios.put(`${baseUrl}/user/update/${id}`, data);
    return res.data;
}
export const getDetailUserById = async (id) => {
    const res = await axios.get(`${baseUrl}/user/get-detail/${id}`);
    return res.data;
}
export const getAllUser = async (filter) => {
    if (filter) {
        const res = await axios.get(`${baseUrl}/user/get-all-user?filter=${filter}`);
        return res.data;
    } else {
        const res = await axios.get(`${baseUrl}/user/get-all-user`);
        return res.data;
    }
}
export const updateBirthday = async (birthday, id) => {
    const res = await axios.put(`${baseUrl}/user/update-birthday`, { birthday, id });
    return res.data;
}
export const sendMailAuth = async (email) => {
    const res = await axios.post(`${baseUrl}/user/auth-mail`, { email });
    return res.data;
}
export const getDetailUser = async (id, access_token) => {
    const res = await axios.get(`${baseUrl}/user/get-detail/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}
export const refreshToken = async (refresh_token) => {
    const res = await axios.post(`${baseUrl}/user/refresh-token`, {
        headers: {
            token: `Bearer ${refresh_token}`
        }
    });
    return res.data;

}
export const handleFollow = async (userId, currentUserId) => {

    const res = await axios.put(`${baseUrl}/user/follow/${userId}`, { currentUserId });
    return res.data;
}
export const handleUnFollow = async (userId, currentUserId) => {

    const res = await axios.put(`${baseUrl}/user/unfollow/${userId}`, { currentUserId });
    return res.data;
}
export const getFriends = async (userId) => {

    const res = await axios.get(`${baseUrl}/user/get-noFriends/${userId}`);
    return res.data;
}

export const getUserByUsername = async (username) => {

    const res = await axios.get(`${baseUrl}/user/get-user/?username=${username}`);
    return res.data;
}



