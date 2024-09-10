import axios from "axios";

export const getChat = async (id) => {

    const res = await axios.get(`${process.env.REACT_APP_LOCAL_HOST}/chat/${id}`);
    return res.data;
}
export const createChat = async (data) => {

    const res = await axios.post(`${process.env.REACT_APP_LOCAL_HOST}/chat/create`, data);
    return res.data;
}


