import axios from "axios";
const baseUrl =process.env.REACT_APP_LOCAL_HOST

export const createNotify = async (data) => {
    const res = await axios.post(`${baseUrl}/notify/create`, data);
    return res.data;
}


export const getAllNotifyById = async (id) => {
    const res = await axios.get(`${baseUrl}/notify/get-by-id/${id}`);
    return res.data;
}
