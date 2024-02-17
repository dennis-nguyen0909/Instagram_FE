import React, { useEffect, useState } from 'react'
import { Story } from '../../component/StoryComponent/Story'
import { Post } from '../../component/Post/Post'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import * as PostService from '../../service/PostService'
import * as UserService from '../../service/UserService'
import { io } from 'socket.io-client';

const socket = io('/', {
    reconnection: true
})
export const HomePage = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const [statePost, setStatePost] = useState([]);
    const [addLikePost, SetAddLikePost] = useState([])
    const [removeLikePost, setRemoveLikePost] = useState([])
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
            const res = await PostService.getAllPost();
            setStatePost(res?.response.posts)
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error fetching posts:", error);
        }
    };
    useEffect(() => {
        getAllPost();
    }, []);

    useEffect(() => {
        socket.on('like', (post) => {
            console.log(post)
            SetAddLikePost(post)
            setRemoveLikePost('')
        })
        socket.on('unlike', (post) => {
            console.log(post)

            SetAddLikePost('')
            setRemoveLikePost(post)
        })

    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ marginBottom: '30px' }}>
                <Story />
            </div>
            <div>
                {uiPost?.map((post, index) => {
                    return (
                        <Post
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
                        />
                    );
                })}

            </div>
        </div>
    )
}