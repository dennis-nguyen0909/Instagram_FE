import axios from "axios"


export const createReel = async (data) => {
    const res = await axios.post("http://localhost:3000/api/reel/create", data);
    return res.data;

}
export const getAllReel = async () => {
    const res = await axios.get("http://localhost:3000/api/reel/get-all");
    return res.data;

}
export const handleLikeReel = async (idUser, idReel) => {
    const res = await axios.put(`http://localhost:3000/api/reel/like/${idReel}`, { idUser });
    return res.data;
}
export const handleCommentPost = async (idUser, idReel, comment) => {
    const res = await axios.put(`http://localhost:3000/api/reel/comment/${idReel}`, { idUser, comment });
    return res.data;
}
export const handleGetReelByUser = async (idUser) => {
    console.log(idUser)
    const res = await axios.get(`http://localhost:3000/api/reel/get-reel-by-user/${idUser}`);
    return res.data;
}