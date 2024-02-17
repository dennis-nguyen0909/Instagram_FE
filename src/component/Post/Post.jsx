import { Image, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import avt from '../../../src/assets/images/slider2.jpg'
import Slider from "react-slick";
import { AvatarComponent } from '../AvartarComponent/AvatarComponent';
import { HeartOutlined, MessageOutlined, ShareAltOutlined, BookOutlined, EllipsisOutlined } from '@ant-design/icons'
import * as PostService from '../../service/PostService'
import * as UserService from '../../service/UserService'
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useMutationHook } from '../../hook/useMutationHook';
import { format, render, cancel, register } from 'timeago.js';

import { faHeart as solidHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import { faComment as regularComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import io from 'socket.io-client';
const host = 'http://localhost:3000';
const socket = io('/', {
    reconnection: true
})

export const Post = (props) => {
    const { images, desc, likes, userName, avatar, userId, postId, postUpdated, postCreated, likesId } = props
    const user = useSelector((state) => state.user)
    const [like, setLike] = useState(likes)
    const [isLike, setIsLike] = useState(false)
    const [notify, setNotify] = useState(false)
    const [disableLikeButton, setDisableLikeButton] = useState(false)
    useEffect(() => {
        const checkIdExsit = likesId.find((item) => item._id === user?.id);
        if (checkIdExsit !== undefined) {
            setIsLike(true)
        } else {
            setIsLike(false)
        }
    })


    const handleLikePost = async () => {
        try {
            const res = await PostService.likePost2({ id: postId, userId: user?.id })

        } catch (error) {
            console.log(error)
        }
        // setLike(isLike ? like - 1 : like + 1)
        setIsLike(!isLike)
    }
    const handleCommentPost = async () => {

    }
    const handleSharePost = () => {

    }
    return (
        <>
            <div style={{ width: '450px', height: '680px', borderBottom: '1px solid #ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                        <Image src={avatar} preview={false} style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
                        <p>{userName}</p>
                        <span style={{ fontSize: '10px', fontWeight: '400', color: 'black' }}>{format(postCreated)}</span>
                    </div>
                    <div style={{ fontSize: '20px' }}>
                        <EllipsisOutlined />
                    </div>
                </div>
                <div style={{ width: '100%' }}>
                    <Image src={images} width={'100%'} height={'450px'} preview={false} />
                </div>
                <div style={{ display: 'flex', fontSize: '26px', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '13px' }}>
                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {isLike ? (<FontAwesomeIcon style={{ color: 'red', cursor: 'pointer' }} icon={solidHeart} onClick={handleLikePost} />) : (
                                <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faHeart} onClick={handleLikePost} />

                            )}
                        </div>
                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={regularComment} flip="horizontal" style={{ cursor: 'pointer' }} onClick={handleCommentPost} />
                        </div>
                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faShare} style={{ cursor: 'pointer' }} onClick={handleSharePost} />
                        </div>
                    </div>
                    <div>
                        <BookOutlined />
                    </div>
                </div>
                <div>
                    <div>
                        {isLike && likes > 1 ? "Bạn và " + (likes - 1) + " người đã thích" : isLike && likes === 1 ? "Bạn đã thích" : likes > 1 ? `${likes} người đã thích` : likes === 1 ? "1 người đã thích" : "Chưa có lượt thích"}
                    </div>


                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold', paddingRight: '10px' }}>{userName}
                            <span style={{ fontWeight: '300', paddingLeft: '10px' }}>{desc}</span>
                        </span>
                        <p style={{ color: '#888' }}>Xem thêm</p>
                    </div>
                    <div>
                        <input style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: 'none', boxShadow: 'none' }} placeholder='Thêm bình luận' />
                    </div>
                </div>
            </div>
        </>
    )
}
