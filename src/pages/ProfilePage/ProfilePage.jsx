import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import * as UserService from '../../service/UserService'
import * as PostService from '../../service/PostService'
import { Avatar, Badge, Button, Card, Drawer, Image, Input, Select, message } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import avatarDefault from '../../assets/images/avatar.jpeg'
import { updateUser, resetUser } from '../../redux/slides/userSlice'
import { useRef } from 'react'
import { HeartOutlined } from '@ant-design/icons';
import axios from 'axios'
import { useMutationHook } from '../../hook/useMutationHook'
import { WrapperAvatar } from '../../pages/ProfilePage/style'
import { useLocale } from 'antd/es/locale'
import { ProfileComponent } from '../../component/ProfileComponent/ProfileComponent'
import { ProfileUserComponent } from '../../component/ProfileUserComponent/ProfileUserComponent'
import socket from '../../socket/socket'

export const ProfilePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState('')
    const { state } = useLocation()
    const user = useSelector((state) => state.user)
    const [addLikes, setAddLikes] = useState([])
    const [removeLikes, setRemoveLikes] = useState([])
    const [userDetail, setUserDetail] = useState({
        id: "",
        userName: '',
        email: '',
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
    })
    const [userName, setUserName] = useState('')
    const [sex, setSex] = useState('')
    const [desc, setDesc] = useState('')
    const query = useQueryClient()
    const getDetailUser = async () => {
        const res = await UserService.getDetailUserById(params.id || state.userId);
        setUserDetail({ ...res.response.data })
    }
    useEffect(() => {
        getDetailUser();
    }, [params.id, userDetail?.avatar])
    const fileInputRef = useRef(null)
    useEffect(() => {
        setAvatar(userDetail?.avatar)
        setUserName(userDetail?.userName)
        setDesc(userDetail?.desc)
        setSex(userDetail?.sex)
    }, [userDetail?.avatar, userDetail?.userName, userDetail?.desc, userDetail?.sex])

    useEffect(() => {
        getDetailUser();
    }, [])
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const handleOnChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleOnChangeSex = (e) => {
        setSex(e.target.value)
    }
    const handleOnChangeDesc = (e) => {
        setDesc(e.target.value)
    }

    const handleLogOut = async () => {
        const res = await UserService.logOut();
        if (+res.EC === 0) {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            dispatch(resetUser())
            navigate('/')

        }

    }
    const handleClickEditAvatar = () => {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }
    const postAvatarToCloundinary = async (pics) => {
        if (pics.type === "image/png" || pics.type === "image/jpeg") {
            const formData = new FormData();
            formData.append('file', pics);
            formData.append('upload_preset', "chat-app");
            formData.append('cloud_name', "dxtz2g7ga");
            axios.post('https://api.cloudinary.com/v1_1/dxtz2g7ga/image/upload', formData)
                .then((data) => {

                    mutation.mutate({ id: user?.id, avatar: data?.data.url.toString() })
                    setAvatar(userDetail?.avatar);
                })
                .catch((err) => {
                    console.error('Cloudinary error', err);
                });
        }
    }
    const mutation = useMutationHook(
        data => {
            const { id, ...rest } = data
            const res = UserService.updateUser(id, rest);
            res.then((result) => {
                if (+result.response.EC === 0) {
                    message.success('Update success!')
                    handleGetDetailUser(user?.id, user?.access_token)

                }
            })
        }
    )
    const handleGetDetailUser = async (id, access_token) => {
        const res = await UserService.getDetailUser(id, access_token);

        dispatch(updateUser({ ...res?.response.data, access_token: access_token }))
        // truyền data mà res trả về vào redux
        // thì bên userSlide sẽ nhận được state và action trong đó action.payload là data user
    }
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        postAvatarToCloundinary(selectedFile)
    }
    const HandleUpload = () => {
        mutation.mutate({ id: user?.id, avatar })
    }
    const handleChange = (value) => {
        setSex(value)
    };
    const updateUserMutation = useMutationHook(
        async (data) => {
            const { id, ...rest } = data
            const res = await UserService.updateUser(id, rest);
            if (res.response.EC === 0) {
                message.success('Ok')
                handleGetDetailUser(user?.id, user?.access_token);
                query.invalidateQueries({ queryKey: ['user-detail'], queryFn: getDetailUser })
                setOpen(false)
            }
        }
    )
    const HandleUpdate = async () => {
        await updateUserMutation.mutate({ id: user?.id, sex, desc, userName })
    }

    const handleGetPost = async () => {
        const res = await PostService.getPostByUser(params.id);
        return res.response.data
    }
    const queryClient = useQueryClient()
    const { data: posts } = useQuery({ queryKey: ['posts'], queryFn: handleGetPost }); // Không gọi handleGetPost ngay lập tức, chỉ truyền tham chiếu của nó vào queryFn
    useEffect(() => {
        socket.on("like", (post) => {
            const filterPost = post.filter((item) => item.userId === user?.id)
            setAddLikes(filterPost)
            console.log("like", filterPost)

            setRemoveLikes('')
        })
        socket.on('unlike', (post) => {
            const filterPost = post.filter((item) => item.userId === user?.id)
            setAddLikes('')
            setRemoveLikes(filterPost)
            console.log("unlike", filterPost)
        })
    }, [])
    let uiPost = [];
    if (addLikes.length > 0) {
        uiPost = addLikes;
    } else if (removeLikes.length > 0) {
        uiPost = removeLikes;
    } else {
        uiPost = posts;
    }
    console.log(uiPost)
    return (
        <>
            {userDetail?._id === user?.id
                ? (
                    <ProfileUserComponent idUser={params.id} listPosts={uiPost} />)
                : (<ProfileComponent idUser={params.id} listPosts={posts} />)}

            <Drawer width={'50%'} title="Chỉnh sửa thông tin cá nhân" onClose={onClose} open={open}>
                <div>
                    <p style={{ fontWeight: 'bold' }}> Tên người dùng:{userDetail?.userName}</p>
                    <Input value={userName} placeholder={userDetail?.userName} color='black' onChange={(e) => handleOnChangeUserName(e)} />
                </div>
                <div>
                    <p style={{ fontWeight: 'bold' }}> Giới tính:</p>
                    <Select

                        defaultValue={userDetail?.sex === 'Nam' ? 'Nam' : userDetail?.sex === 'Nữ' ? 'Nữ' : 'Khác'}

                        style={{
                            width: '100%',
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: 'Nam',
                                label: 'Nam',
                            },
                            {
                                value: 'Nữ',
                                label: 'Nữ',
                            },
                            {
                                value: 'Khác',
                                label: 'Khác',
                            },
                        ]}
                    />
                </div>
                <div>
                    <p style={{ fontWeight: 'bold' }}> Tiểu sử</p>
                    <Input value={desc} placeholder={userDetail?.desc} onChange={(e) => handleOnChangeDesc(e)} />
                </div>
                <div style={{ display: 'flex', marginTop: '100px' }}>
                    <Button onClick={HandleUpdate}>Update</Button>
                </div>
            </Drawer>
        </>
    )
}
