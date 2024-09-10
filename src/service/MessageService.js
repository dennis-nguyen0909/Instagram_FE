import axios from "axios";
const baseUrl =process.env.REACT_APP_LOCAL_HOST

export const getMessage = async (id) => {

    const res = await axios.get(`${baseUrl}/message/get-message/${id}`);
    return res.data;
}
export const addMessage = async (message) => {

    const res = await axios.post(`${baseUrl}/message/create`, message);
    return res.data;
}
export const getMessageAllChats = async (userId) => {

    const res = await axios.get(`${baseUrl}/message/get-all-message/${userId}`);
    return res.data;
}


