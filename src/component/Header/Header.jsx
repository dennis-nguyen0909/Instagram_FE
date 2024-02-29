import React, { useEffect, useRef, useState } from 'react'
import {
    HomeOutlined, HomeFilled,
    MenuOutlined, SearchOutlined,
    CompassOutlined, VideoCameraOutlined, MessageFilled, CompassFilled,
    MessageOutlined, HeartOutlined, PlusSquareOutlined, PlusSquareFilled, HeartFilled, VideoCameraFilled, PlaySquareOutlined
} from '@ant-design/icons';
import axios from 'axios';
import * as PostService from '../../service/PostService'
import { Avatar, Badge, Button, Col, Drawer, Image, Input, Modal, Row, Space, message } from 'antd';
import { NavDiv, WrapperContainer } from './style';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import defaultPost from '../../assets/images/default.png'
import * as UserService from '../../service/UserService'
import * as NotifyService from '../../service/NotifyService'
import * as ChatService from '../../service/ChatService'

import socket from '../../socket/socket'
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Header = () => {
    const user = useSelector((state) => state.user)
    const message = useSelector((state) => state.message)

    const postRef = useRef(null)
    const [descPost, setDescPost] = useState('')
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [post, setPost] = useState()
    const [roomChats, setRoomChats] = useState([])
    const [notify, setNotify] = useState('')
    const [messageRealTime, setMessageRealTime] = useState(0)
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const onClose2 = () => {
        setOpen2(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState(null)
    const handleCreateNotify = async (data) => {
        const res = await NotifyService.createNotify(data);

    }
    useEffect(() => {
        socket.on('new-message', newMessage => {
            setMessageRealTime((prev) => prev + 1)
        })
    }, [])

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };
    useEffect(() => {
        if (activeItem === 'AVT') {
            navigate(`/profile/${user.id}`);
        } else if (activeItem === 'search') {
            setOpen(true)
        } else if (activeItem === 'home') {
            navigate('/')
        } else if (activeItem === 'create') {
            showModal()
        } else if (activeItem === 'notify') {
            setOpen2(true)
        } else if (activeItem === 'message') {
            navigate(`/direct/inbox`)
        } else {
            navigate('/')
        }
    }, [activeItem]);
    const handleCreatePost = async () => {
        const res = await PostService.createPost({ id: user?.id, desc: descPost, images: post })
        if (+res.response.EC === 0) {
            message.success("Create post is success!!")
            setIsModalOpen(false);

        } else {
            message.error("Có lỗi");
            setIsModalOpen(true);
        }

    }
    const handleSelectedPic = () => {
        if (postRef.current && postRef) {
            postRef.current.click()
        }
    }
    const handleOpenDrawer = () => {
        setOpen(true)
    }

    const handleGetDetailUser = async (userId) => {
        const res = await UserService.getDetailUserById(userId);
        return res.response.data
    }

    const uploadPost = async (pics) => {
        if (pics.type === "image/png" || pics.type === "image/jpeg") {
            const formData = new FormData();
            formData.append('file', pics);
            formData.append('upload_preset', "chat-app");
            formData.append('cloud_name', "dxtz2g7ga");
            axios.post('https://api.cloudinary.com/v1_1/dxtz2g7ga/image/upload', formData)
                .then((data) => {

                    setPost(data?.data.url.toString() + "");
                })
                .catch((err) => {
                    console.error('Cloudinary error', err);
                });
        }
    }
    const location = useLocation()
    useEffect(() => {
        if (location.pathname === '/') {
            handleItemClick('home')
        }
    }, [location])
    const onChangeDescPost = (e) => {
        setDescPost(e.target.value)
    }
    const getChat = async () => {
        const res = await ChatService.getChat(user?.id);
        setRoomChats(res?.response.data);
    }
    useEffect(() => {
        getChat()
    }, [])

    return (
        <WrapperContainer>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '30px', paddingLeft: '10px' }}>
                <h2 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Instagram</h2>
            </div>
            <NavDiv>
                <div onClick={() => handleItemClick('home')} className={activeItem === 'home' ? 'active' : ''}>
                    {activeItem === 'home' ? <HomeFilled /> : <HomeOutlined />}
                    <p>Trang chủ</p>
                </div>
                <div onClick={() => handleItemClick('search')} className={activeItem === 'search' ? 'active' : ''}>
                    {activeItem === 'search' ? <SearchOutlined /> : <SearchOutlined />}

                    <p>Tìm kiếm</p>
                </div>
                <div onClick={() => handleItemClick('discovery')} className={activeItem === 'discovery' ? 'active' : ''}>
                    {activeItem === 'discovery' ? <CompassFilled /> : <CompassOutlined />}

                    <p>Khám phá</p>
                </div>
                <div onClick={() => handleItemClick('reels')} className={activeItem === 'reels' ? 'active' : ''}>
                    {activeItem === 'reels' ? <VideoCameraFilled /> : <VideoCameraOutlined />}

                    <p>Reels </p>
                </div>
                <div onClick={() => handleItemClick('message')} className={activeItem === 'message' ? 'active' : ''}>
                    {activeItem === 'message' ?
                        (
                            <Badge>
                                <MessageFilled />
                            </Badge>
                        )
                        : (
                            <Badge style={{ fontSize: '10px', display: 'flex' }} count={messageRealTime} size='small'>
                                < MessageOutlined />
                                <p>Tin nhắn</p>
                            </Badge>

                        )}
                    {/* <Space size="large">
                        <Badge count={99}>
                            <MessageOutlined shape="square" size="large" />
                        </Badge>
                        <p>Tin nhắn</p>
                    </Space> */}

                </div>
                <div onClick={() => handleItemClick('notify')} className={activeItem === 'notify' ? 'active' : ''} >
                    {activeItem === 'notify' ? <HeartFilled /> : <HeartOutlined />}
                    <p>Thông báo</p>
                </div>
                <div onClick={() => handleItemClick('create')} className={activeItem === 'create' ? 'active' : ''}>
                    {activeItem === 'create' ? <PlusSquareFilled /> : <PlusSquareOutlined />}

                    <p>Tạo</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('AVT')} className={activeItem === 'AVT' ? 'active' : ''}>
                    <img src={user?.avatar} style={{ width: '25px', height: '25px', borderRadius: '50%' }}></img>
                    <p style={{ right: '5' }}>Trang cá nhân</p>
                </div>
            </NavDiv>
            <div style={{ display: 'flex', gap: '10px', fontSize: '18px', paddingLeft: '10px', marginBottom: '10px' }}>
                <MenuOutlined />
                <p>Xem thêm</p>
            </div>
            <Drawer style={{ marginLeft: '70px' }} title="Search" placement="left" onClose={onClose} open={open}>
                <div style={{ marginBottom: '40px' }} >
                    <h2>Search</h2>
                    <Input placeholder="search" />
                </div>
                <div style={{ borderTop: '1px solid #ccc' }}>
                    <h2> recent
                    </h2>

                </div>
            </Drawer>
            {/* <Modal
                footer={null}
                title="Tạo bài viết"
                width={800} open={isModalOpen}
                onOk={handleOk} onCancel={handleCancel}>
                <div style={{ display: 'flex', gap: '20px', maxHeight: '500px' }}>
                    <div style={{ height: '500px', width: '500px' }} >
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>

                            <Button onClick={handleSelectedPic}>Chọn ảnh từ máy tính</Button>
                            {post ? (<Image src={post} preview={false} style={{ width: '400px', height: '500px', maxWidth: '400px', maxHeight: '500px' }} />) : <Image src={defaultPost} preview={false} />}

                            <input type='file' accept='image/*'
                                onChange={(e) => uploadPost(e.target.files[0])}
                                ref={postRef} style={{ display: 'none' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', marginLeft: '10px', gap: '10px', alignItems: 'center' }}>
                            <Image src={user?.avatar} preview={false} width={'40px'} height={'40px'} style={{ borderRadius: '50%' }} />
                            <p style={{ fontWeight: 'bold' }}>{user?.userName || user.name}</p>
                        </div>
                        <div style={{ marginLeft: '10px' }}>
                            <Input value={descPost} onChange={(e) => onChangeDescPost(e)} placeholder='Viết chú thích' width={'100%'} style={{ border: 'transparent', outline: 'none' }} />
                        </div>
                    </div>
                    <Button onClick={handleCreatePost}>Create</Button>
                </div>
            </Modal> */}

            <Modal
                footer={null}
                title="Tạo bài viết"
                width={800} open={isModalOpen}
                onOk={handleOk} onCancel={handleCancel}>
                <div style={{ display: 'flex', gap: '20px', maxHeight: '500px' }}>
                    <PlaySquareOutlined />
                    <FontAwesomeIcon icon={faImage} />

                </div>
            </Modal>
            <Drawer style={{ marginLeft: '180px' }} title="Thông báo" placement='left' onClose={onClose2} open={open2}>
                <h1 style={{ fontSize: '16px' }}>Hôm nay</h1>
                {/* <div style={{ borderTop: '1px solid #ccc' }}>
                    {notifyMessage?.data.map((notify) => {

                        // Kiểm tra xem thông báo có liên quan đến bài viết của người dùng hiện tại không
                        if (notify.userId) {
                            return (
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <img src={notify?.avatar} style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
                                    <p>{notify.message}</p>
                                </div>
                            );
                        }
                    })}
                </div> */}
            </Drawer>


        </WrapperContainer >
    )
}
