import axios from "axios"


export const createReel = async (data) => {
    const res = await axios.post("http://localhost:3000/api/reel/create", data);
    return res.data;

}
export const getAllReel = async () => {
    const res = await axios.get("http://localhost:3000/api/reel/get-all");
    return res.data;

}