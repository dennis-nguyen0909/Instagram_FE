import React, { useEffect, useRef, useState } from 'react'
import {
    HomeOutlined, HomeFilled,
    MenuOutlined, SearchOutlined,
    CompassOutlined, VideoCameraOutlined, MessageFilled, CompassFilled,
    MessageOutlined, HeartOutlined, PlusSquareOutlined, PlusSquareFilled, HeartFilled, VideoCameraFilled
} from '@ant-design/icons';
import axios from 'axios';
import * as PostService from '../../service/PostService'
import { Avatar, Button, Col, Drawer, Image, Input, Modal, Row, message } from 'antd';
import { NavDiv, WrapperContainer } from './style';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import defaultPost from '../../assets/images/default.png'
import * as UserService from '../../service/UserService'
import * as NotifyService from '../../service/NotifyService'
import { useQuery } from '@tanstack/react-query';
//socket
import io from 'socket.io-client';
const host = 'http://localhost:3000';

const socket = io('/', {
    reconnection: true
})


export const Header = () => {
    const user = useSelector((state) => state.user)
    const postRef = useRef(null)
    const [descPost, setDescPost] = useState('')
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [post, setPost] = useState()
    const socketRef = useRef()
    const [notify, setNotify] = useState('')
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
    const handleGetAllNotifyById = async () => {
        const res = await NotifyService.getAllNotifyById(user?.id);
        return res.response
    }
    const { data: notifyMessage } = useQuery({
        queryKey: ['notify'], queryFn: handleGetAllNotifyById
    })


    const handleItemClick = async (itemName) => {
        setActiveItem(itemName)
        // console.log(itemName)
        switch (itemName) {
            case 'AVT':
                navigate(`/profile/${String(user.id)}`)
                break;
            case 'search':
                setOpen(true)
                break;
            case 'home':
                navigate('/')
                break;
            case 'create':
                showModal()
                break;
            case 'notify':
                setOpen2(true)
                break;
            default:
                break;

        }
    }
    const handleCreatePost = async () => {
        const res = await PostService.createPost({ id: user?.id, desc: descPost, images: post })
        console.log(res)
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


    // useEffect(() => {
    //     // Chỉ kết nối socket nếu chưa được kết nối
    //     if (!socketRef.current) {
    //         socketRef.current = io.connect(host);

    //         // Lắng nghe sự kiện từ server để thông báo đã có người like bài viết
    //         socketRef.current.on('notifyOwnerPostLiked', async ({ userId, postId, userPost }) => {
    //             try {

    //                 const res = await handleGetDetailUser(userId);
    //                 // const notifyMessage = `${res.userName} đã like bài viết của ${userPost}`;
    //                 const notifyMessage = `${res.userName} đã like bài viết của bạn`;
    //                 setNotify(notifyMessage);
    //                 await handleCreateNotify({ userId, postId, notify: notifyMessage, avatar: res.avatar, userPost });
    //                 message.success(notifyMessage)
    //             } catch (error) {
    //                 console.error('Error:', error);
    //             }
    //         });
    //     }

    //     // Clear kết nối khi component unmount
    //     return () => {
    //         if (socketRef.current) {
    //             socketRef.current.disconnect(); // Ngắt kết nối socket
    //             socketRef.current = null; // Đặt biến ref về null để chỉ ra rằng kết nối đã được ngắt
    //         }
    //     };
    // }, []);


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
                    {activeItem === 'message' ? <MessageFilled /> : <MessageOutlined />}

                    <p>Tin nhắn</p>
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
                <div>
                </div>
            </NavDiv>
            <div style={{ display: 'flex', gap: '10px', fontSize: '15px', paddingLeft: '10px' }}>
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
            <Modal title="Tạo bài viết" width={800} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
            </Modal>

            <Drawer style={{ marginLeft: '180px' }} title="Thông báo" placement='left' onClose={onClose2} open={open2}>
                <h1 style={{ fontSize: '16px' }}>Hôm nay</h1>
                <div style={{ borderTop: '1px solid #ccc' }}>
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
                </div>
            </Drawer>


        </WrapperContainer >
    )
}
