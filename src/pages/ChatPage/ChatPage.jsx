import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../component/Header/Header'
import React, { useEffect, useState } from 'react'
import * as UserService from '../../service/UserService'
import { useQueries, useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment as regularComment, faHeart, faBookmark, faPenToSquare, faFaceSmile, } from '@fortawesome/free-regular-svg-icons';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

import {
    InfoCircleOutlined,
    HomeOutlined, HomeFilled,
    MenuOutlined, SearchOutlined,
    CompassOutlined, VideoCameraOutlined, MessageFilled, CompassFilled,
    MessageOutlined, HeartOutlined, PlusSquareOutlined, PlusSquareFilled, HeartFilled, VideoCameraFilled
} from '@ant-design/icons';
import { faFacebookMessenger, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { NavDiv, WrapperContainer } from '../../component/Header/style';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-regular-svg-icons'
import { Avatar, Popover, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { InputNotOutline } from '../../component/Post/style';
import { ChatBox } from '../../component/ChatBox/ChatBox';
import * as MessageService from '../../service/MessageService'
import * as ChatService from '../../service/ChatService'
import { Conversation } from '../../component/Conversation/Conversation';
import socket from '../../socket/socket';
import { addMessage } from '../../redux/slides/messageSlice';
export default function ChatPage() {
    const dispatch = useDispatch()
    const [chats, setChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [messageRealTime, setMessageRealTime] = useState([])
    const user = useSelector((state) => state.user)
    const params = useParams();
    const [activeItem, setActiveItem] = useState(null)
    const navigate = useNavigate()
    const handleItemClick = async (itemName) => {
        setActiveItem(itemName)
    }

    useEffect(() => {
        if (activeItem === 'home') {
            navigate('/')
        } else if (pathname === '/direct/inbox') {
            setActiveItem('message')
        }
    }, [activeItem])
    const [displayEmoji, setDisplayEmoji] = useState(false)
    const [comment, setComment] = useState('')
    const [openEmoji, setOpenEmoji] = useState(false);

    useEffect(() => {
        const getChats = async () => {
            try {
                const res = await ChatService.getChat(user.id);
                setChats(res.response.data)
            } catch (error) {
                return error;
            }
        }
        getChats();
    }, [user.id])

    useEffect(() => {
        socket.on('new-message', (mess) => {
            dispatch(addMessage({
                messageChat: {
                    chatId: mess.chatId,
                    senderId: mess.senderId,
                    text: mess.text,
                    createdAt: mess.createdAt,
                    id: mess._id,
                }
            }))
            setMessageRealTime(mess)

        })
    }, [socket])
    const { pathname } = useLocation()
    const getDetailUserById = async () => {
        const res = await UserService.getDetailUserById(params.id);
        return res.response.data
    }
    const { data: userDetail } = useQuery({ queryKey: ['userDetail'], queryFn: getDetailUserById });

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
    const handleToggleEmoji = () => {
        setDisplayEmoji(!displayEmoji)
    }
    const handlePostComment = (e) => {
        setComment(e.target.value)
    }
    useEffect(() => {
        const getMessages = async () => {
            const res = await MessageService?.getMessage(currentChat?._id);
            setMessages(res.response.data)
        }
        if (currentChat?._id) {
            getMessages();
        }
    }, [currentChat, messageRealTime])
    const uiMessage = messageRealTime.length > 1 ? messageRealTime : messages;
    return (
        <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '100%' }}>
            <div style={{ flex: 0, display: 'flex', flexDirection: 'column', fontSize: '30px', gap: '20px', borderRight: '1px solid #ccc', height: '100vh', padding: '0 25px', position: 'fixed', zIndex: 10 }}>
                <div style={{ margin: '30px 0', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faInstagram} onClick={() => navigate('/')} />
                </div>
                <div>
                    <HomeOutlined onClick={() => handleItemClick('home')} />
                </div>
                <div>
                    <SearchOutlined />
                </div>
                <div>
                    <CompassOutlined />
                </div>
                <div>
                    <VideoCameraOutlined />
                </div>
                <div>
                    {activeItem ? (<MessageFilled />) : (<MessageOutlined />)}

                </div>
                <div>
                    <HeartOutlined />
                </div>
                <div>
                    <PlusSquareOutlined />
                </div>
                <div>
                    <Avatar src={user?.avatar} style={{ width: '30px', height: '30px' }} />
                </div>
            </div>
            <div style={{ flex: 0.4, width: '360px', borderRight: '1px solid #ccc', marginLeft: '100px', height: '100vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px', marginTop: '20px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '20px' }}> {userDetail?.userName}</p>
                    <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '20px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 15px' }}>
                    <p style={{ fontWeight: 'bold' }}>Tin nhắn</p>
                    <p style={{ color: 'rgb(115,115,115)', fontWeight: 'bold' }}>Tin nhắn đang chờ</p>
                </div>
                <div>
                    {chats?.map((chat) => {
                        return (
                            <div style={{ cursor: 'pointer' }} onClick={() => setCurrentChat(chat)}>
                                <Conversation
                                    currentChat={currentChat}
                                    uiMessage={uiMessage}
                                    key={chat?._id}
                                    data={chat}
                                    currentUser={user} />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div style={{ flex: 1 }}>
                {currentChat ? (
                    <ChatBox
                        currentChat={currentChat}
                        chatId={currentChat?._id}
                        userDetail={userDetail}
                        currentUser={user}
                        idUrl={params?.id}
                        messageArray={uiMessage} />
                ) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', height: '100vh' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <FontAwesomeIcon icon={faFacebookMessenger} size='5x' />
                        <span>Click to chat</span>
                    </div>
                </div>}
            </div>

        </div>
    )
}
