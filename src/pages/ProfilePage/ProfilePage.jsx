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
import { WrapperAvatar } from './style'
import { useLocale } from 'antd/es/locale'
export const ProfilePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState('')
    const { state } = useLocation()

    const user = useSelector((state) => state.user)
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
        // return res.response.data
    }

    useEffect(() => {
        getDetailUser();
    }, [params.id, userDetail?.avatar])
    // console.log(userDetail)
    // const { data } = useQuery({ queryKey: ['user-detail'], queryFn: getDetailUser })
    // const userDetail = data
    const fileInputRef = useRef(null)
    useEffect(() => {
        setAvatar(user?.avatar)
        setUserName(user?.userName)
        setDesc(user?.desc)
        setSex(user?.sex)
    }, [user?.avatar, user?.userName, user?.desc, user?.sex])

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
        console.log(res)
        return res.response.data
    }

    const { data: posts } = useQuery({ queryKey: ['posts'], queryFn: handleGetPost }); // Không gọi handleGetPost ngay lập tức, chỉ truyền tham chiếu của nó vào queryFn

    console.log(userDetail)

    return (
        <>
            <Button onClick={handleLogOut}>Thoat</Button>
            <div style={{ borderBottom: '1px solid #ccc', margin: '0 50px' }}>
                <div style={{ height: '230px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '90px' }}>
                        <WrapperAvatar >
                            {avatar ? (
                                <img className='avt' preview={false} src={avatar} style={{
                                    height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%'
                                }} />
                            ) : <Image className='avt' src={avatarDefault} preview={false} style={{
                                height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%'
                            }} />}
                            {/* <Button className='btn' onClick={handleClickEditAvatar}>Chinh sua</Button> */}
                            {/* <Button onClick={HandleUpload}>Thay đổi ảnh đại diện</Button> */}
                            <Button style={{ margin: '10px 0' }} onClick={handleClickEditAvatar}>Thay đổi ảnh đại diện</Button>
                            <input type='file'
                                accept='image/*'
                                ref={fileInputRef}
                                onChange={(e) => postAvatarToCloundinary(e.target.files[0])}
                                style={{ display: 'none' }}></input>
                        </WrapperAvatar>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
                                <p style={{ fontWeight: 'bold' }}>{userDetail?.userName}</p>
                                <Button
                                    onClick={showDrawer}
                                    style={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgb(239,239,239)'
                                    }} >Chỉnh sửa trang cá nhân</Button>
                                <Button
                                    style={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgb(239,239,239)'
                                    }}>Xem kho lưu trữ</Button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <p style={{ fontWeight: 'bold' }}>{userDetail?.posts.length}</p>
                                    <span>Bài viết</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <p style={{ fontWeight: 'bold' }}>{userDetail?.followers.length}</p>
                                    <span>Người theo dõi</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span>Đang theo dõi</span>
                                    <p style={{ fontWeight: 'bold' }}>{userDetail?.followings.length}</p>
                                    <span>người dùng</span>
                                </div>

                            </div>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>{userDetail?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '20px', marginLeft: '120px' }}>
                {posts?.map((post) => (
                    <div key={post.id} style={{ position: 'relative', display: 'inline-block' }}>
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <HeartOutlined style={{ fontSize: '32px', color: '#fff' }} />
                        </div>
                        <Image
                            src={post.images}
                            width={300}
                            height={300}
                            style={{ padding: '0 3px', transition: 'filter 0.3s ease' }}
                            preview={{
                                mask: <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />,
                                maskClassName: 'custom-mask',
                            }}
                            className="custom-image"
                        />
                    </div>
                ))}
            </div>

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
