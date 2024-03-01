
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DownOutlined, HeartOutlined } from '@ant-design/icons'
import * as UserService from '../../service/UserService'
import { Avatar, Button, Drawer, Image, Input, Select, message } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import avatarDefault from '../../assets/images/avatar.jpeg'
import * as PostService from '../../service/PostService'
import * as ChatService from '../../service/ChatService'
import { WrapperAvatar } from '../../pages/ProfilePage/style'
import socket from '../../socket/socket'
export const ProfileComponent = ({ idUser, listPosts }) => {
    const [userDetail, setUserDetail] = useState(null);
    // const [posts, setPosts] = useState(listPosts)
    const [isFollow, setIsFollow] = useState(false)
    const [followRealTime, setFollowRealTime] = useState([])
    const [unFollowRealTime, setUnFollowRealTime] = useState([])
    const user = useSelector((state) => state.user)
    const query = useQueryClient();
    const params = useParams()
    console.log("listPosts", listPosts)
    const getDetailUserById = async () => {
        try {
            const res = await UserService.getDetailUserById(idUser);
            return res.response.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    const fetchData = async () => {
        const userData = await getDetailUserById();
        setUserDetail(userData);
    };
    // const handleGetPostByUserId = async () => {
    //     const res = await PostService.getPostByUser(userDetail?._id);
    //     setPosts(res?.response?.data)
    // }

    useEffect(() => {
        if (idUser) {
            fetchData();
            // handleGetPostByUserId();
        }
    }, [idUser]);
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
        socket.on("follow", (data) => {
            console.log("follow", data)
        })
        socket.on("un-follow", (data) => {
            console.log("un-follow", data)
        })
    }, [])

    useEffect(() => {
        if (userDetail) {
            const checkIdExsit = userDetail?.followers.find((item) => item === user?.id)
            setIsFollow(checkIdExsit !== undefined)
        }
    }, [userDetail]);
    const navigate = useNavigate()
    const handleNavigateChat = async (id) => {
        await ChatService.createChat({ senderId: user?.id, receiverId: id })
        navigate(`/direct/inbox/${id}`)
    }


    return (
        <div style={{ margin: '0 100px' }}>
            <div style={{ height: '230px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #ccc', }}>
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

            <div style={{ marginTop: '50px', marginLeft: '120px', display: 'flex' }}>
                {listPosts?.map((post) => (
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

        </div>
    )
}
