import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: "",
    userName: '',
    email: '',
    password: '',
    isAdmin: false,
    phone: '',
    followers: [],
    followings: [],
    avatar: '',
    coverPicture: '',
    desc: '',
    address: '',
    city: '',
    districts: '',
    ward: '',
    access_token: '',
    refresh_token: '',
    posts: [],
}
export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {

            const { userName = '', email = '', access_token = '', phone = '',
                address = '', avatar = '', _id = '', isAdmin, city = '',
                districts = '', ward = '', refresh_token = '',
                posts = [], followers = [], followings = []
                , coverPicture = '',
                desc = '', } = action.payload


            state.id = _id;
            state.userName = userName;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.access_token = access_token;
            state.isAdmin = isAdmin;
            state.city = city;
            state.districts = districts;
            state.ward = ward;
            state.refresh_token = refresh_token;
            state.posts = posts;
            state.desc = desc;
            state.followers = followers;
            state.followings = followings;
            state.coverPicture = coverPicture;
            // return { ...state, ...action.payload }
        },
        updateUserFollow: (state, action) => {

            const { user, access_token } = action.payload;
            const {
                userName = '', email = '', phone = '',
                address = '', avatar = '', _id = '', isAdmin, city = '',
                districts = '', ward = '', refresh_token = '',
                posts = [], followers = [], followings = [],
                coverPicture = '', desc = ''
            } = user;
            console.log(userName)
            state.id = _id;
            state.userName = userName;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.access_token = access_token;
            state.isAdmin = isAdmin;
            state.city = city;
            state.districts = districts;
            state.ward = ward;
            state.refresh_token = refresh_token;
            state.posts = posts;
            state.desc = desc;
            state.followers = followers;
            state.followings = followings;
            state.coverPicture = coverPicture;
            // return { ...state }
        },
        resetUser: (state, action) => {
            state.id = "";
            state.name = "";
            state.email = "";
            state.phone = "";
            state.address = "";
            state.avatar = "";
            state.access_token = "";
            state.isAdmin = false;
            state.city = "";
            state.districts = "";
            state.ward = "";
            state.refresh_token = "";
            state.posts = "";
            state.desc = "";
            state.followers = [];
            state.followings = [];
            state.coverPicture = "";

        },
    }

})
export const { updateUser, resetUser, updateUserFollow } = userSlide.actions
export default userSlide.reducer