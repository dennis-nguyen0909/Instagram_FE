
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import * as UserService from '../../service/UserService'
import { Avatar, Button, Drawer, Image, Input, Select, message } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import avatarDefault from '../../assets/images/avatar.jpeg'
import * as PostService from '../../service/PostService'
import { WrapperAvatar } from '../../pages/ProfilePage/style'

export const ProfileComponent = ({ username }) => {
    const [userDetail, setUserDetail] = useState(null);
    const [isFollow, setIsFollow] = useState(false)
    const user = useSelector((state) => state.user)
    const query = useQueryClient();
    const getUserByUserName = async () => {
        try {
            const res = await UserService.getUserByUsername(username);
            console.log(res)
            return res.response.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    const fetchData = async () => {
        const userData = await getUserByUserName();
        setUserDetail(userData);
    };

    useEffect(() => {
        if (username) {
            fetchData();
        }
    }, [username]);



    const handleFollow = async () => {
        const res = await UserService.handleFollow(userDetail._id, user?.id)
        if (res.response.code === 200) {
            message.success(res.response.message)
            fetchData();
            // query.invalidateQueries({ queryKey: ['user'], queryFn: getUserByUserName })

        } else {
            message.error(res.response.message)
        }
        setIsFollow(!isFollow)
    }
    const handleUnFollow = async () => {
        const res = await UserService.handleUnFollow(userDetail._id, user?.id)
        if (res.response.code === 200) {
            message.success(res.response.message)
            // query.invalidateQueries({ queryKey: ['user'], queryFn: getUserByUserName })
            fetchData()
        } else {
            message.error(res.response.message)
        }
        setIsFollow(!isFollow)
    }
    useEffect(() => {
        if (userDetail) {
            const checkIdExsit = userDetail?.followers.find((item) => item === user?.id)
            setIsFollow(checkIdExsit !== undefined)
        }
    }, [userDetail]);
    const handleGetPostByUser = async () => {
        console.log(userDetail?._id)
        const res = await PostService.getPostByUser(userDetail?._id);
        console.log(res);


    }
    console.log("userDetail", userDetail)
    const navigate = useNavigate()
    useEffect(() => {
        handleGetPostByUser();
    }, [])
    const handleNavigateChat = async (id) => {
        navigate(`/direct/inbox/${id}`)
    }
    return (
        <div style={{ borderBottom: '1px solid #ccc', margin: '0 100px' }}>
            <div style={{ height: '230px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '90px' }}>
                    <WrapperAvatar >
                        {userDetail?.avatar ? (
                            <img className='avt' preview={false} src={userDetail?.avatar} style={{
                                height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%'
                            }} />
                        ) : <Image className='avt' src={avatarDefault} preview={false} style={{
                            height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%'
                        }} />}
                    </WrapperAvatar>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                            <p style={{ fontWeight: 'bold' }}>{userDetail?.userName}</p>
                            {isFollow ? (
                                <Button
                                    onClick={handleUnFollow}
                                    style={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgb(239,239,239)'

                                    }} >Đang theo dõi <DownOutlined style={{ fontWeight: 'bold', fontSize: '16px' }} /></Button>
                            ) : (<Button
                                onClick={handleFollow}
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    backgroundColor: 'rgb(18,152,247)'
                                }} >Theo dõi</Button>)}

                            <Button
                                onClick={() => handleNavigateChat(userDetail._id)}
                                style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    backgroundColor: 'transparent'
                                }}>Nhắn tin</Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '400px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <p style={{ fontWeight: 'bold' }}>{userDetail?.posts.length}</p>
                                <p>Bài viết</p>
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
            <div>

            </div>
        </div>
    )
}
