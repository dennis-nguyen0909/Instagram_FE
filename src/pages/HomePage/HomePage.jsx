import React, { useEffect, useRef, useState } from 'react'
import { Story } from '../../component/StoryComponent/Story'
import { Post } from '../../component/Post/Post'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import * as PostService from '../../service/PostService'
import socket from '../../socket/socket'
import * as NotifyService from '../../service/NotifyService'
import * as ChatService from '../../service/ChatService'
import LoadingComponent from '../../component/LoadingComponent/LoadingComponent'
import { message } from 'antd'

export const HomePage = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const [statePost, setStatePost] = useState([]);
    const [addLikePost, SetAddLikePost] = useState([])
    const [removeLikePost, setRemoveLikePost] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [notifyRealTime, setNotifyRealTime] = useState([])
    const [notify, setNotify] = useState([])
    const [loading, setLoading] = useState(false)
    const [roomChats, setChats] = useState([])

    useEffect(() => {
        if (user?.access_token) {
            navigate('/')
        } else {
            navigate('/login')
        }
    }, [user])
    let uiPost = [];
    if (addLikePost.length > 0) {
        uiPost = addLikePost;
    } else if (removeLikePost.length > 0) {
        uiPost = removeLikePost;
    } else {
        uiPost = statePost;
    }

    const getAllPost = async () => {
        try {
            setLoading(true)
            const res = await PostService.getAllPost();
            setStatePost(res?.response.posts)
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error fetching posts:", error);
        }
        setLoading(false)
    };
    useEffect(() => {
        getAllPost();
    }, []);

    const addNotify = async (data) => {
        const res = await NotifyService.createNotify(data);
        if (+res.response.EC === 0) {
            setNotify(res?.response?.data)
        } else {
            console.log('error')
        }

    }
    const getChat = async () => {
        const res = await ChatService.getChat(user?.id);
        setChats(res?.response.data);
    }
    useEffect(() => {
        getChat()
    }, [])
    // console.log('chats', roomChats.map((item) => item?._id?.includes(message?.idChat)))
    // console.log("checkk", roomChats.map((item) => item?.includes(message.idChat)))
    useEffect(() => {
        socket.on('like', async (post) => {
            // console.log("like", post)
            SetAddLikePost(post)
            setRemoveLikePost('')
        })
        socket.on('unlike', async (post) => {
            // console.log("unlike", post)
            SetAddLikePost('')
            setRemoveLikePost(post)

        })
        socket.emit('addNewUser', user?.id);
        socket.on('onlineUsers', (res) => {
            setOnlineUsers(res)

        })
        socket.on('notify-like', async (findPost, user) => {
            await addNotify({ ownerId: findPost?.userId, postId: findPost?._id, userId: user?._id, avatar: user?.avatar, message: "Like" })
        })
        socket.on('new-notify-like', (data) => {
            if (data?.ownerId._id === user?.id) {
                setNotifyRealTime(data)
            }
        });
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ marginBottom: '30px' }}>
                <Story onlineUsers={onlineUsers} />
            </div>
            <div>
                <LoadingComponent isLoading={loading}>
                    {uiPost?.map((post, index) => {
                        return (
                            <Post
                                loading={loading}
                                key={index}
                                desc={post?.desc}
                                images={post?.images}
                                likes={post?.likes.length}
                                likesId={post?.likes}
                                userName={post?.user?.userName || post?.user?.name}
                                avatar={post?.user?.avatar}
                                userId={post?.user?._id}
                                postId={post?._id}
                                postUpdated={post.updatedAt}
                                postCreated={post.createdAt}
                                commentPost={post.comments}
                            />
                        );
                    })}
                </LoadingComponent>

            </div>
        </div>
    )
}
