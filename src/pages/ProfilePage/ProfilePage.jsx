import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import * as UserService from '../../service/UserService'
import { Avatar, Button, Drawer, Image, Input, Select, message } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import avatarDefault from '../../assets/images/avatar.jpeg'
import { updateUser, resetUser } from '../../redux/slides/userSlice'
import { useRef } from 'react'
import axios from 'axios'
import { useMutationHook } from '../../hook/useMutationHook'
import { WrapperAvatar } from './style'
export const ProfilePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState('')

    const user = useSelector((state) => state.user)
    const [userName, setUserName] = useState('')
    const [sex, setSex] = useState('')
    const [desc, setDesc] = useState('')
    const query = useQueryClient()
    const getDetailUser = async () => {
        const res = await UserService.getDetailUserById(params.id);
        return res.response.data
    }

    const { data } = useQuery({ queryKey: ['user-detail'], queryFn: getDetailUser })
    const userDetail = data
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

                    setAvatar(data?.data.url.toString() + "");
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


    return (
        <>
            <Button onClick={handleLogOut}>Thoat</Button>
            <div style={{ borderBottom: '1px solid #ccc', margin: '0 150px' }}>
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
                            <Button className='btn' onClick={handleClickEditAvatar}>Chinh sua</Button>
                            <Button onClick={HandleUpload}>Save</Button>
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
