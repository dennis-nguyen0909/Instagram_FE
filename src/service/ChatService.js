import axios from "axios";

export const getChat = async (id) => {

    const res = await axios.get(`http://localhost:3000/api/chat/${id}`);
    return res.data;
}
export const createChat = async (data) => {

    const res = await axios.post(`http://localhost:3000/api/chat/create`, data);
    return res.data;
}


