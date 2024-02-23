import axios from 'axios'
export const axiosJWT = axios.create()
export const loginUser = async (data) => {
    const res = await axios.post(`http://localhost:3000/api/user/login`, data);
    return res.data;
}
export const logOut = async () => {
    const res = await axios.post(`http://localhost:3000/api/user/log-out`);
    return res.data;
}
export const registerUser = async (email, fullName, userName, password, confirmPassword) => {
    const res = await axios.post(`http://localhost:3000/api/user/create`, { email, password, userName, fullName, confirmPassword });
    return res.data;
}
export const updateUser = async (id, data) => {
    const res = await axios.put(`http://localhost:3000/api/user/update/${id}`, data);
    return res.data;
}
export const getDetailUserById = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/user/get-detail/${id}`);
    return res.data;
}
export const getAllUser = async () => {
    const res = await axios.get(`http://localhost:3000/api/user/get-all-user`);
    return res.data;
}
export const updateBirthday = async (birthday, id) => {
    const res = await axios.put(`http://localhost:3000/api/user/update-birthday`, { birthday, id });
    return res.data;
}
export const sendMailAuth = async (email) => {
    const res = await axios.post(`http://localhost:3000/api/user/auth-mail`, { email });
    return res.data;
}
export const getDetailUser = async (id, access_token) => {
    const res = await axios.get(`http://localhost:3000/api/user/get-detail/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}
export const refreshToken = async (refresh_token) => {
    const res = await axios.post(`http://localhost:3000/api/user/refresh-token`, {
        headers: {
            token: `Bearer ${refresh_token}`
        }
    });
    return res.data;

}
export const handleFollow = async (userId, currentUserId) => {
    console.log(userId, currentUserId)
    const res = await axios.put(`http://localhost:3000/api/user/follow/${userId}`, { currentUserId });
    return res.data;
}
export const handleUnFollow = async (userId, currentUserId) => {

    const res = await axios.put(`http://localhost:3000/api/user/unfollow/${userId}`, { currentUserId });
    return res.data;
}
export const getFriends = async (userId) => {

    const res = await axios.get(`http://localhost:3000/api/user/friends/${userId}`);
    return res.data;
}

export const getUserByUsername = async (username) => {

    const res = await axios.get(`http://localhost:3000/api/user/get-user/?username=${username}`);
    return res.data;
}



