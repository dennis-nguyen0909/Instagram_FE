import axios from "axios"
const baseUrl =process.env.REACT_APP_LOCAL_HOST


export const createReel = async (data) => {
    const res = await axios.post(`${baseUrl}/reel/create`, data);
    return res.data;

}
export const getAllReel = async () => {
    const res = await axios.get(`${baseUrl}/reel/get-all`);
    return res.data;

}
export const handleLikeReel = async (idUser, idReel) => {
    const res = await axios.put(`${baseUrl}/reel/like/${idReel}`, { idUser });
    return res.data;
}
export const handleCommentPost = async (idUser, idReel, comment) => {
    const res = await axios.put(`${baseUrl}/reel/comment/${idReel}`, { idUser, comment });
    return res.data;
}
export const handleGetReelByUser = async (idUser) => {
    console.log(idUser)
    const res = await axios.get(`${baseUrl}/reel/get-reel-by-user/${idUser}`);
    return res.data;
}