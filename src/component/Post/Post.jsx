import { Avatar, Button, Image, Input, Modal, Popover, message } from 'antd'
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
import vi from 'timeago.js/lib/lang/vi';
import { faHeart as solidHeart, faShare, faBookBookmark, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faComment as regularComment, faHeart, faBookmark, faFaceSmile, } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import io from 'socket.io-client';
import { WrapperInput, ModalContent, ModalWrapper, WrapperButton, WrapperAccount, WrapperModalRight, WrapperIcon, WrapperIconModal, WrapperEditPost, WrapperComment, ScrollContent, InputNotOutline } from './style';
import { CommentList } from '../CommentList/CommentList';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useNavigate } from 'react-router-dom';
const host = 'http://localhost:3000';
const socket = io('/', {
    reconnection: true,
    auth: {
        serverOffset: 0
    },
    ackTimeout: 10000,
    retries: 3,
})
// const socket = io()


export const Post = (props) => {
    const { images, desc, likes, userName,
        avatar, userId, postId,
        postUpdated, postCreated, likesId, commentPost } = props
    // Config dateTime
    register('vi', vi);
    const formattedTime = format(postCreated, 'vi');
    // 
    const user = useSelector((state) => state.user)
    const [like, setLike] = useState(likes)
    const [isLike, setIsLike] = useState(false)
    const [notify, setNotify] = useState(false)
    const [disableLikeButton, setDisableLikeButton] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState(commentPost)
    const [commentRealTime, setCommentRealTime] = useState(commentPost)
    const focusComment = useRef();
    const [displayEmoji, setDisplayEmoji] = useState(false)
    const navigate = useNavigate()
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // const Modal = ({ isOpen, onClose, children }) => {
    //     if (!isOpen) return null; // Không hiển thị nếu isOpen là false

    //     return (
    //         <ModalWrapper >
    //             <ModalContent>
    //                 {children}
    //                 <WrapperButton onClick={onClose}>X</WrapperButton>
    //             </ModalContent>
    //         </ModalWrapper>
    //     );
    // };
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
            await PostService.likePost2({ id: postId, userId: user?.id })

        } catch (error) {
            console.log(error)
        }
        // setLike(isLike ? like - 1 : like + 1)
        setIsLike(!isLike)
    }
    const handleCommentPost = async () => {
        showModal()
    }
    const handleSharePost = () => {

    }
    const handleUpdatePostComment = async (postId, userId, comment) => {
        const res = await PostService.commentsPost({ id: postId, userId: userId, comment })

        if (res.response.code === 200) {
            message.success('Comment thanh cong!')

            setComment('')
        } else {
            message.error('That bai');
        }
    }
    const getAllPost = async () => {
        try {
            const res = await PostService.getAllPost();

        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error fetching posts:", error);
        }
    };

    const handlePostComment = (e) => {
        setComment(e.target.value)

    }
    const postCommentToSocket = () => {

        handleUpdatePostComment(postId, user?.id, comment)
    }
    useEffect(() => {
        // socket.on('new-comment', (msg) => {
        //     setCommentRealTime(msg)
        // })
        socket.on('new-comment2', (msg) => {
            setCommentRealTime(msg)

        })
    }, [])

    const handleToggleEmoji = () => {
        setDisplayEmoji(!displayEmoji)
    }


    const uiComments = commentRealTime.length > 1 ? commentRealTime : comments;
    const handleDeletePost = async (postId) => {
        const res = await PostService.deletePost(postId, user?.access_token);
        if (res.response.EC === 0) {
            message.success('Xóa thành công')
        } else {
            message.error(res.reponse.EM)
        }
    }
    const content = () => {
        return (
            <>
                <WrapperEditPost>
                    <div className='btn' onClick={() => handleDeletePost(postId)}>Delete</div>
                </WrapperEditPost>
            </>
        )
    }
    const [text, setText] = useState('');
    const commentRef = useRef(null);
    const handleScroll = (e) => {
        const amountScroll = 50;
        commentRef.current.scrollTop += amountScroll * e
        commentRef.current.style.transition = 'transform 0.05s ease'; // Áp dụng transition
        // commentRef.current.style.transform = `translateY(${commentRef.current.scrollTop}px)`;
    }

    const handleFocusComment = () => {
        if (focusComment && focusComment.current) {
            focusComment.current.focus()
        }
    }
    const [openEmoji, setOpenEmoji] = useState(false);
    const hide = () => {
        setOpenEmoji(false);
    };
    const handleOpenChangeEmoji = (newOpen) => {
        setOpenEmoji(newOpen);
    };
    const handleEmojiClick = (e) => {
        setComment(comment + e.native);
    };
    const ComponentEmoji = () => {
        return (
            <>
                <div>
                    <Picker data={data} onEmojiSelect={handleEmojiClick} />
                </div>
            </>
        )
    }

    const navigateProfileUser = (username) => {
        console.log('click', username)
        setTimeout(() => {
            navigate(`/${username}`)
        }, 2000)
    }
    return (
        <>
            <div style={{ width: '468px', height: '700px', borderBottom: '1px solid #ccc' }} >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                        <Image src={avatar} preview={false} style={{ width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}
                            onClick={() => navigateProfileUser(userName)}
                        />
                        <p>{userName}</p>
                        <span style={{ fontSize: '10px', fontWeight: '400', color: 'black' }}>{formattedTime}</span>
                    </div>
                    <div style={{ fontSize: '20px' }}>
                        <Popover content={content} title={'Edit'} placement='bottom' style={{ cursor: 'pointer' }} >
                            <EllipsisOutlined style={{ cursor: 'pointer' }} />
                        </Popover>
                    </div>
                </div>
                <div style={{ width: '100%' }}>
                    <Image src={images} style={{ borderRadius: '3px' }} width={'100%'} height={'468px'} preview={false} />
                </div>
                <WrapperIcon>
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
                    <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faBookmark} style={{ cursor: 'pointer' }} />
                    </div>
                </WrapperIcon>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ paddingTop: '10px' }}>
                        {isLike && likes > 1 ?
                            (<span>
                                <span style={{ fontWeight: 'bold' }}>Bạn </span>
                                và {likes - 1} người đã thích</span>)
                            : isLike && likes === 1 ? "Bạn đã thích" : likes > 1 ? `${likes} người đã thích` : likes === 1 ? "1 người đã thích" : "Chưa có lượt thích"}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                        <div style={{ display: 'flex' }}>
                            <p style={{ fontWeight: 'bold', paddingRight: '8px' }}>{userName}</p>
                            <p>{desc}</p>
                        </div>
                        <div style={{ color: '#888' }}>Xem tất cả bình luận</div>
                    </div>
                    <WrapperInput style={{ marginTop: '10px' }}>
                        <input value={comment} onChange={(e) => setComment(e.target.value)} style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: 'none', boxShadow: 'none', width: '100%', fontSize: '14px' }}
                            placeholder='Thêm bình luận' />
                    </WrapperInput>
                </div>
            </div >
            <Modal

                style={{ padding: 0, border: '0' }}
                footer={null}
                width={1400} open={isModalOpen}

                onOk={handleOk} onCancel={handleCancel}>
                <div style={{ display: 'flex', gap: '20px', maxHeight: '700px', height: '650px' }}>
                    <div style={{ display: 'flex' }}>
                        <div >
                            <img style={{ borderRadius: '3px' }} width={'765px'} height={'650px'} src={images} />
                        </div>
                        <div style={{ width: '560px', display: 'flex', flexDirection: 'column' }}>
                            <WrapperModalRight>
                                <WrapperAccount>
                                    <Avatar src={avatar} size={'large'} />
                                    <p style={{ fontWeight: 'bold', }}>{userName}</p>
                                </WrapperAccount>
                                <div>
                                    <FontAwesomeIcon icon={faEllipsis} style={{ fontSize: '20px' }} />
                                </div>
                            </WrapperModalRight>
                            <div>
                                <div style={{ padding: '0 10px' }}>
                                    <WrapperComment onWheel={(e) => handleScroll(Math.sign(e.deltaY))} ref={commentRef} >
                                        {/* <ScrollContent scrollPosition={scrollPosition}> */}

                                        <WrapperAccount>
                                            <Avatar src={avatar} size={'large'} />
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <div style={{ fontWeight: 'bold', }}>{userName}</div>
                                                        <div style={{ fontWeight: '400' }}>{desc}</div>
                                                    </div>
                                                    <div style={{ fontSize: '10px', color: 'rgb(115,115,115)', paddingTop: '5px' }}>
                                                        {formattedTime}
                                                    </div>
                                                </div>

                                            </div>
                                        </WrapperAccount>
                                        <CommentList comments={uiComments} />

                                    </WrapperComment>
                                </div>
                            </div>
                            <WrapperIconModal>
                                <WrapperIcon>
                                    <div style={{ display: 'flex', gap: '13px', position: 'relative' }}>
                                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {isLike ? (<FontAwesomeIcon style={{ color: 'red', cursor: 'pointer' }} icon={solidHeart} onClick={handleLikePost} />) : (
                                                <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faHeart} onClick={handleLikePost} />

                                            )}
                                        </div>
                                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                            <FontAwesomeIcon icon={regularComment} flip="horizontal" style={{ cursor: 'pointer' }} onClick={handleFocusComment} />
                                        </div>
                                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                            <FontAwesomeIcon icon={faShare} style={{ cursor: 'pointer' }} onClick={handleSharePost} />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                        <FontAwesomeIcon icon={faBookmark} style={{ cursor: 'pointer' }} />
                                    </div>
                                </WrapperIcon>
                                <div style={{ paddingTop: '10px' }}>
                                    {formattedTime}
                                </div>
                            </WrapperIconModal>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginLeft: '10px' }}>
                                <Popover
                                    content={ComponentEmoji}
                                    title="Emoji"
                                    trigger="click"
                                    open={openEmoji}
                                    onOpenChange={handleOpenChangeEmoji}
                                >
                                    <FontAwesomeIcon onClick={handleToggleEmoji} icon={faFaceSmile} size='2x' style={{ cursor: 'pointer' }} />
                                </Popover>
                                <InputNotOutline
                                    ref={focusComment}
                                    value={comment}
                                    placeholder='Thêm bình luận'
                                    onChange={(e) => handlePostComment(e)}
                                />
                                <div style={{ marginRight: '10px' }}>
                                    <span style={{ cursor: 'pointer', fontWeight: 'bold', color: 'rgb(18,152,247)' }} onClick={postCommentToSocket} >Đăng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal >


            {/* <Modal onOpen={openModal} isOpen={isOpen} onClose={closeModal}>
                <div style={{ display: 'flex' }}>
                    <div >
                        <img width={'765px'} height={'760px'} src={images} />
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <WrapperModalRight>
                            <WrapperAccount>
                                <Avatar src={avatar} size={'large'} />
                                <p style={{ fontWeight: 'bold', }}>{userName}</p>
                            </WrapperAccount>
                            <div>
                                <FontAwesomeIcon icon={faEllipsis} style={{ fontSize: '20px' }} />
                            </div>
                        </WrapperModalRight>

                        <div>
                            <div style={{ padding: '0 10px', height: '550px' }}>
                                <WrapperAccount>
                                    <Avatar src={avatar} size={'large'} />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <div style={{ fontWeight: 'bold', }}>{userName}</div>
                                                <div style={{ fontWeight: '400' }}>{desc}</div>
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'rgb(115,115,115)', paddingTop: '5px' }}>
                                                {formattedTime}
                                            </div>
                                        </div>

                                    </div>
                                </WrapperAccount>
                                <WrapperAccount>
                                    <Avatar src={avatar} size={'large'} />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <div style={{ fontWeight: 'bold', }}>{userName}</div>
                                                <div style={{ fontWeight: '400' }}>{desc}</div>
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'rgb(115,115,115)', paddingTop: '5px' }}>
                                                {formattedTime}
                                            </div>
                                        </div>

                                    </div>
                                </WrapperAccount>

                            </div>
                        </div>
                        <WrapperIconModal>
                            <WrapperIcon>
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
                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faBookmark} style={{ cursor: 'pointer' }} />
                                </div>
                            </WrapperIcon>
                            <div style={{ paddingTop: '10px' }}>
                                {formattedTime}
                            </div>
                        </WrapperIconModal>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginTop: '10px', marginLeft: '10px' }}>
                            <div>
                                <FontAwesomeIcon icon={faFaceSmile} size='2x' />
                            </div>
                            <input value={comment} onChange={(e) => setComment(e.target.value)}></input>

                            <div style={{ marginRight: '10px' }}>
                                <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={handlePostComment} >Đăng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal > */}

        </>
    )
}
