import axios from "axios";

export const getMessage = async (id) => {

    const res = await axios.get(`http://localhost:3000/api/message/get-message/${id}`);
    return res.data;
}
export const addMessage = async (message) => {

    const res = await axios.post(`http://localhost:3000/api/message/create`, message);
    return res.data;
}


