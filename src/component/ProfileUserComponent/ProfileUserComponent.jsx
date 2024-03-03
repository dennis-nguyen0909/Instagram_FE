import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import * as UserService from '../../service/UserService'
import * as PostService from '../../service/PostService'
import { Avatar, Badge, Button, Card, Col, Drawer, Image, Input, Modal, Popover, Row, Select, message } from 'antd'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import avatarDefault from '../../assets/images/avatar.jpeg'
import { updateUser, resetUser } from '../../redux/slides/userSlice'
import { useRef } from 'react'
import { HeartOutlined } from '@ant-design/icons';
import axios from 'axios'
import { useMutationHook } from '../../hook/useMutationHook'
import { WrapperAvatar } from '../../pages/ProfilePage/style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faEllipsis, faFaceSmile, faGear, faTableCells, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { faBookmark, faPlusCircle } from '@fortawesome/free-regular-svg-icons';
import { WrapperDivIcon, WrapperPosts } from './style'
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons'
import ModalComponent from '../ModalComponent/ModalComponent'
import { InputNotOutline, WrapperAccount, WrapperComment, WrapperIcon } from '../Post/style'
import './style.css'
import { CommentList } from '../CommentList/CommentList'
import socket from '../../socket/socket'
export const ProfileUserComponent = ({ idUser, listPost }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState('')
    const { state } = useLocation()
    const user = useSelector((state) => state.user)
    const [currentSteps, setCurrentSteps] = useState('posts')
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
    const [comments, setComments] = useState([])
    const [commentRealTime, setCommentRealTime] = useState([])
    const [like, setLike] = useState([])
    const [isLike, setIsLike] = useState(false)
    const [addLikePost, SetAddLikePost] = useState([])
    const [removeLikePost, setRemoveLikePost] = useState([])
    const [comment, setComment] = useState('')
    const [displayEmoji, setDisplayEmoji] = useState(false)
    const [postDetail, setPostDetail] = useState(null);
    const [userName, setUserName] = useState('')
    const [sex, setSex] = useState('')
    const [desc, setDesc] = useState('')
    const query = useQueryClient()


    const getDetailUser = async () => {
        const res = await UserService.getDetailUserById(idUser);
        setUserDetail({ ...res.response.data })
    }
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

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
    const handleItemClick = (item) => {
        if (item === 'posts') {
            setCurrentSteps(item)
        } else if (item === 'bookMark') {
            setCurrentSteps(item)
        } else if (item === 'tag') {
            setCurrentSteps(item)
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
                getDetailUser()
                setOpen(false)
            }
        }
    )
    const HandleUpdate = async () => {
        await updateUserMutation.mutate({ id: user?.id, sex, desc, userName })
    }

    const handleGetPost = async () => {
        const res = await PostService.getPostByUser(idUser);
        return res.response.data
    }
    const content = () => {
        return (
            <div>
                <span style={{ cursor: 'pointer' }} onClick={handleLogOut}>Đăng xuất</span>
            </div>
        )
    }
    const { data: posts } = useQuery({ queryKey: ['posts'], queryFn: handleGetPost });

    const getDetailPost = async (id) => {
        const res = await PostService.getDetailPost(id);
        setComments(res?.response?.data?.comments)
        setPostDetail(res.response.data)
    }

    const handleOpenPost = async (idPost) => {
        await getDetailPost(idPost);
        // showModal()
        toggleModal();
    }
    const handleSharePost = () => {

    }
    useEffect(() => {
        const checkIdExsit = postDetail?.likes.find((item) => item === user?.id);
        if (checkIdExsit !== undefined) {
            setIsLike(true)
        } else {
            setIsLike(false)
        }
    })
    const focusComment = useRef(null)
    const handleFocusComment = () => {
        if (focusComment && focusComment.current) {
            focusComment.current.focus()
        }
    }
    const handleLikePost = async () => {
        try {
            await PostService.likePost2({ id: postDetail?._id, userId: user?.id })

        } catch (error) {
            console.log(error)
        }
        // setLike(isLike ? like - 1 : like + 1)
        setIsLike(!isLike)
    }

    const handleOnChangeComment = (e) => {
        setComment(e.target.value)

    }
    const postCommentToSocket = () => {
        handleUpdatePostComment(postDetail?._id, user?.id, comment)
    }
    const handleToggleEmoji = () => {
        setDisplayEmoji(!displayEmoji)
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
    const handleUpdatePostComment = async (postId, userId, comment) => {
        const res = await PostService.commentsPost({ id: postId, userId: userId, comment })
        if (res.response.code === 200) {
            message.success('Comment thanh cong!')
            setComment('')
        } else {
            message.error('That bai');
        }
    }
    useEffect(() => {
        socket.on('new-comment2', (msg) => {
            setCommentRealTime(msg)
        })
        socket.on('like', async (post) => {
            console.log("like", post)
            SetAddLikePost(post)
            setRemoveLikePost('')
        })
        socket.on('unlike', async (post) => {
            console.log("unlike", post)
            SetAddLikePost('')
            setRemoveLikePost(post)

        })
    }, [])
    const uiComments = commentRealTime.length > 1 ? commentRealTime : comments;
    const scrollRef = useRef();
    const commentRef = useRef(null);
    const handleScroll = (e) => {
        const amountScroll = 50;
        commentRef.current.scrollTop += amountScroll * e
        commentRef.current.style.transition = 'transform 0.05s ease'; // Áp dụng transition
        // commentRef.current.style.transform = `translateY(${commentRef.current.scrollTop}px)`;
    }
    let uiPost = [];
    if (addLikePost.length > 0) {
        uiPost = addLikePost;
    } else if (removeLikePost.length > 0) {
        uiPost = removeLikePost;
    } else {
        uiPost = posts;
    }
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const handleImageChangeIndex = (index) => {
        setCurrentImageIndex(index)
    }
    const [currentImageIndexDetail, setCurrentImageIndexDetail] = useState(0)
    const handleImageChangeIndexDetail = (index) => {
        setCurrentImageIndex(index)
    }
    return (
        <div style={{ marginBottom: '100px' }}>
            <div style={{ borderBottom: '1px solid #ccc', margin: '0 130px' }}>
                <div style={{ height: '230px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 0' }}>
                    <div style={{ display: 'flex', gap: '90px' }}>
                        <WrapperAvatar >
                            {avatar ? (
                                <img className='avt' preview={false} src={avatar} style={{
                                    height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%'
                                }} />
                            ) : <Image className='avt' src={avatarDefault} preview={false} style={{
                                height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%'
                            }} />}
                            {/* 
                            <Button style={{ margin: '10px 0' }} onClick={handleClickEditAvatar}>Thay đổi ảnh đại diện</Button>
                            <input type='file'
                                accept='image/*'
                                ref={fileInputRef}
                                onChange={(e) => postAvatarToCloundinary(e.target.files[0])}
                                style={{ display: 'none' }}></input> */}
                            <FontAwesomeIcon icon={faCirclePlus} style={{ fontSize: '60px', marginTop: '30px', cursor: 'pointer' }} />
                        </WrapperAvatar>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
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
                                <Popover content={content} title="Title">
                                    <FontAwesomeIcon icon={faGear} style={{ fontSize: '20px', cursor: 'pointer' }} />
                                </Popover>
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
            <WrapperDivIcon>
                <div onClick={() => handleItemClick('posts')} className={currentSteps === 'posts' ? 'active' : ''}>
                    <FontAwesomeIcon icon={faTableCells} />
                    <span>Bài viết</span>
                </div>
                <div onClick={() => handleItemClick('bookMark')} className={currentSteps === 'bookMark' ? 'active' : ''}>
                    <FontAwesomeIcon icon={faBookmark} />
                    Đã lưu</div>
                <div onClick={() => handleItemClick('tag')} className={currentSteps === 'tag' ? 'active' : ''} >
                    <FontAwesomeIcon icon={faUserTag} />
                    Được gắn thẻ
                </div>
            </WrapperDivIcon>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
                {currentSteps === 'posts' && uiPost?.map((post) => (
                    <WrapperPosts key={post.id} onClick={() => handleOpenPost(post?._id)}>
                        {post?.images.length > 1 ? (
                            <div style={{ position: 'relative' }}>
                                <img
                                    className='post-img'
                                    src={post.images[currentImageIndexDetail]}
                                    width={308}
                                    height={300}
                                    preview={false}
                                />
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '20px', left: '0', width: '100%', gap: '10px' }}>
                                    {post?.images.map((_, index) => (
                                        <span key={index} style={{ color: index === currentImageIndex ? '#fff' : '#ccc', cursor: 'pointer', fontSize: '30px' }}
                                            onClick={() => handleImageChangeIndexDetail(index)}>•</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <img
                                className='post-img'
                                src={post.images}
                                width={308}
                                height={300}
                                preview={false}
                            />
                        )}

                        <div className='post-icon' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <FontAwesomeIcon icon={faHeart} />
                                <p>{post?.likes.length}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <FontAwesomeIcon icon={faComment} />
                                <p>{post?.comments.length}</p>
                            </div>
                        </div>
                    </WrapperPosts>
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
            <div style={{ position: 'relative' }} >
                {showModal && (
                    <>
                        <div className="modal-overlay" >
                            <div className="modal-content">
                                <div style={{ width: '1100px', height: '90vh' }}>
                                    <Row>
                                        <Col span={14}>
                                            {postDetail?.images?.length > 1 ? (
                                                <div style={{ position: 'relative' }}>
                                                    <img src={postDetail?.images[currentImageIndex]} style={{ width: '100%', height: '90vh', objectFit: 'cover', }} />
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '20px', left: '0', width: '100%', gap: '10px' }}>
                                                        {postDetail?.images.map((_, index) => (
                                                            <span key={index} style={{ color: index === currentImageIndex ? '#fff' : '#ccc', cursor: 'pointer', fontSize: '30px' }}
                                                                onClick={() => handleImageChangeIndex(index)}>•</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <img src={postDetail?.images} style={{ width: '100%', height: '90vh', objectFit: 'cover', }} />
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
        </div >
    )
}
