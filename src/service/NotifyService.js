import axios from "axios";

export const createNotify = async (data) => {
    const res = await axios.post(`http://localhost:3000/api/notify/create`, data);
    return res.data;
}


export const getAllNotifyById = async (id) => {
    const res = await axios.get(`http://localhost:3000/api/notify/get-by-id/${id}`);
    return res.data;
}
