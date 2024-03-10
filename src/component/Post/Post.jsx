import { Avatar, Button, Col, Image, Input, Modal, Popover, Row, message } from 'antd'
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
import { faHeart as solidHeart, faShare, faBookBookmark, faEllipsis, faComment } from '@fortawesome/free-solid-svg-icons';
import { faComment as regularComment, faHeart, faBookmark, faFaceSmile, } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import io from 'socket.io-client';
import { WrapperInput, ModalContent, ModalWrapper, WrapperButton, WrapperAccount, WrapperModalRight, WrapperIcon, WrapperIconModal, WrapperEditPost, WrapperComment, ScrollContent, InputNotOutline } from './style';
import { CommentList } from '../CommentList/CommentList';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useNavigate } from 'react-router-dom';
import socket from '../../socket/socket';


export const Post = (props) => {
    const { images, desc, likes, userName,
        avatar, userId, postId,
        postUpdated, postCreated, likesId, commentPost, loading } = props
    // Config dateTime
    register('vi', vi);
    const formattedTime = format(postCreated, 'vi');
    const user = useSelector((state) => state.user)
    const [like, setLike] = useState(likes)
    const [isLike, setIsLike] = useState(false)
    const [notify, setNotify] = useState(false)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState(commentPost)
    const [commentRealTime, setCommentRealTime] = useState(commentPost)
    const focusComment = useRef();
    const [displayEmoji, setDisplayEmoji] = useState(false)
    const [loadingComment, setLoadingComment] = useState(false)
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const navigate = useNavigate()
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
        setIsLike(!isLike)
    }
    const handleCommentPost = async () => {
        toggleModal();

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
            console.error("Error fetching posts:", error);
        }
    };
    const handleOnChangeComment = (e) => {
        setComment(e.target.value)

    }
    const postCommentToSocket = () => {

        handleUpdatePostComment(postId, user?.id, comment)
    }
    useEffect(() => {
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
            message.error(res.response.EM)
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
        setTimeout(() => {
            navigate(`/${username}`)
        }, 2000)
    }
    const scrollRef = useRef();
    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
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
                    {images?.length > 1 ? (
                        <div style={{ position: 'relative' }}>
                            <Image src={images[currentImageIndex]} style={{ borderRadius: '3px' }} width={'100%'} height={'468px'} preview={false} />
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '20px', left: '0', width: '100%', gap: '10px' }}>
                                {images.map((_, index) => (
                                    <span key={index} style={{ color: index === currentImageIndex ? '#fff' : '#ccc', cursor: 'pointer', fontSize: '30px' }}
                                        onClick={() => handleImageChange(index)}>•</span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Image src={images} style={{ borderRadius: '3px' }} width={'100%'} height={'468px'} preview={false} />
                    )}
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
                        <div style={{ color: '#888', cursor: 'pointer' }} onClick={handleCommentPost}>Xem tất cả bình luận</div>
                    </div>
                    {/* <WrapperInput style={{ marginTop: '10px' }}>
                        <input value={comment} onChange={(e) => setComment(e.target.value)} style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: 'none', boxShadow: 'none', width: '100%', fontSize: '14px' }}
                            placeholder='Thêm bình luận' />
                    </WrapperInput> */}
                </div>
            </div >
            <div style={{ position: 'relative', zIndex: 999 }} >
                {showModal && (
                    <>
                        <div className="modal-overlay" >
                            <div className="modal-content">
                                <div style={{ width: '1100px', height: '90vh' }}>
                                    <Row>
                                        <Col span={14}>
                                            {images?.length > 1 ? (
                                                <div style={{ position: 'relative' }}>
                                                    <img src={images[currentImageIndex]} style={{ width: '100%', height: '90vh', objectFit: 'cover', }} />
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '20px', left: '0', width: '100%', gap: '10px' }}>
                                                        {images.map((_, index) => (
                                                            <span key={index} style={{ color: index === currentImageIndex ? '#fff' : '#ccc', cursor: 'pointer', fontSize: '30px' }}
                                                                onClick={() => handleImageChange(index)}>•</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>

                                                    <img src={images} style={{ width: '100%', height: '90vh', objectFit: 'cover', }} />
                                                </>
                                            )}
                                        </Col>
                                        <Col span={10}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', borderBottom: '1px solid #ccc', padding: '0 10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                                                    <Avatar src={user?.avatar} />
                                                    <p>{user?.userName}</p>
                                                </div>
                                                <div>
                                                    <FontAwesomeIcon icon={faEllipsis} />
                                                </div>
                                                <button style={{ position: 'absolute', right: '-100px', top: '5px', cursor: 'pointer' }} onClick={toggleModal}>X</button>
                                            </div>
                                            <div>
                                                {comments?.length === 0 ? (
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px', borderBottom: '1px solid #ccc', paddingBottom: '280px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <b style={{ fontSize: '18px' }}>Chưa có bình luận nào</b>
                                                                <p >Bắt đầu trò chuyện</p>
                                                            </div>
                                                        </div>
                                                        <WrapperIcon>
                                                            <div style={{ display: 'flex', gap: '13px', position: 'relative' }}>
                                                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                    {isLike ? (<FontAwesomeIcon style={{ color: 'red', cursor: 'pointer' }} icon={faHeart} onClick={handleLikePost} />) : (
                                                                        <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faHeart} onClick={handleLikePost} />

                                                                    )}
                                                                </div>
                                                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                                                    <FontAwesomeIcon icon={faComment} flip="horizontal" style={{ cursor: 'pointer' }} onClick={handleFocusComment} />
                                                                </div>
                                                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                                                    <FontAwesomeIcon icon={faShare} style={{ cursor: 'pointer' }} onClick={handleSharePost} />
                                                                </div>
                                                            </div>
                                                            <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                                                <FontAwesomeIcon icon={faBookmark} style={{ cursor: 'pointer' }} />
                                                            </div>
                                                        </WrapperIcon>
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
                                                                onChange={(e) => handleOnChangeComment(e)}
                                                            />
                                                            <div style={{ marginRight: '10px' }}>
                                                                <span style={{ cursor: 'pointer', fontWeight: 'bold', color: 'rgb(18,152,247)' }} onClick={postCommentToSocket} >Đăng</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div style={{ display: 'flex', padding: '0 10px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <WrapperComment onWheel={(e) => handleScroll(Math.sign(e.deltaY))} ref={commentRef}  >
                                                                    <WrapperAccount>
                                                                        <Avatar src={avatar} size={'large'} />
                                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                                                    <div style={{ fontWeight: 'bold', }}>{userName}</div>
                                                                                    <div style={{ fontWeight: '400' }}>{desc}</div>
                                                                                </div>
                                                                                <div style={{ fontSize: '10px', color: 'rgb(115,115,115)', paddingTop: '5px' }}>
                                                                                    {/* {formattedTime} */}
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </WrapperAccount>
                                                                    <div ref={scrollRef} >
                                                                        <CommentList comments={uiComments} />
                                                                    </div>
                                                                </WrapperComment>
                                                            </div>
                                                        </div>
                                                        <WrapperIcon>
                                                            <div style={{ display: 'flex', gap: '13px', position: 'relative' }}>
                                                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                    {isLike ? (<FontAwesomeIcon style={{ color: 'red', cursor: 'pointer' }} icon={solidHeart} onClick={handleLikePost} />) : (
                                                                        <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faHeart} onClick={handleLikePost} />

                                                                    )}
                                                                </div>
                                                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                                                    <FontAwesomeIcon icon={faComment} flip="horizontal" style={{ cursor: 'pointer' }} onClick={handleFocusComment} />
                                                                </div>
                                                                <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                                                    <FontAwesomeIcon icon={faShare} style={{ cursor: 'pointer' }} onClick={handleSharePost} />
                                                                </div>
                                                            </div>
                                                            <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                                                                <FontAwesomeIcon icon={faBookmark} style={{ cursor: 'pointer' }} />
                                                            </div>
                                                        </WrapperIcon>
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
                                                                onChange={(e) => handleOnChangeComment(e)}
                                                            />
                                                            <div style={{ marginRight: '10px' }}>
                                                                <span style={{ cursor: 'pointer', fontWeight: 'bold', color: 'rgb(18,152,247)' }} onClick={postCommentToSocket} >Đăng</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </>
    )
}
