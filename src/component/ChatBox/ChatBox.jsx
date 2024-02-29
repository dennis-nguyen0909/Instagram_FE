
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment as regularComment, faFaceSmile, } from '@fortawesome/free-regular-svg-icons';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import {
    InfoCircleOutlined,

} from '@ant-design/icons';
import { Popover, message } from 'antd';
import { InputNotOutline } from '../../component/Post/style';
import { WrapperMessage } from './style';
import * as MessageService from '../../service/MessageService'
import * as UserService from '../../service/UserService'

import { useSelector } from 'react-redux';
import { format } from 'timeago.js';

import io from 'socket.io-client'
import { MessageComponent } from '../MessageComponent/MessageComponent';
import socket from '../../socket/socket';
export const ChatBox = ({ userDetail, messageArray, chatId, currentUser, currentChat }) => {

    const [displayEmoji, setDisplayEmoji] = useState(false)
    const [openEmoji, setOpenEmoji] = useState(false);
    const [message, setMessage] = useState('')
    const [messageData, setMessageData] = useState(messageArray)
    const [messageRealTime, setMessageRealTime] = useState(messageArray)
    const [userChat, setUserChat] = useState(null)
    const user = useSelector((state) => state.user)
    const scrollRef = useRef()


    const getDetailUserById = async () => {
        const idChat = currentChat?.members?.filter((item) => item !== currentUser.id)
        const res = await UserService.getDetailUserById(idChat)
        setUserChat(res.response.data)
    }
    useEffect(() => {
        getDetailUserById();

    }, [chatId])
    useEffect(() => {
        setMessageData(messageArray);
    }, [messageArray]);
    const hide = () => {
        setOpenEmoji(false);
    };
    const handleOpenChangeEmoji = (newOpen) => {
        setOpenEmoji(newOpen);
    };
    const handleEmojiClick = (e) => {
        setMessage(message + e.native);
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
    const handleAddMessage = (e) => {
        setMessage(e.target.value)
    }


    // Send Message
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newMessageData = {
            senderId: user.id,
            text: message, // Sử dụng giá trị của message đã được nhập
            chatId: chatId,
        };
        try {
            const res = await MessageService.addMessage(newMessageData);
            if (res?.response.code === 200) {
                setMessageData([...messageData, res.response.data]);
                setMessage("")
                // alert('okk')
            }


        } catch (error) {
            console.log("error:", error);
            // Xử lý lỗi nếu cần
        }
    }
    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messageData])
    useEffect(() => {
        socket.on('new-message', (data) => {
            setMessageRealTime(data)
        })
    }, [])
    const uiMessage = messageRealTime?.length > 1 ? messageRealTime : messageData
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1000px', padding: '10px 20px', boxSizing: 'border-box', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={userChat?.avatar} style={{ width: '55px', height: '55px', borderRadius: '50%' }} />
                    <p>{userChat?.userName}</p>
                </div>
                <div style={{ padding: '10px' }}>
                    <InfoCircleOutlined style={{ fontSize: '26px' }} />
                </div>
            </div>
            <div style={{ maxHeight: '700px', overflowY: 'auto', height: '650px' }} >
                <MessageComponent uiMessage={uiMessage} userDetail={userChat} user={user} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginLeft: '10px', justifyContent: 'space-between', alignSelf: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Popover
                            content={ComponentEmoji}
                            title="Emoji"
                            trigger="click"
                            open={openEmoji}
                            onOpenChange={handleOpenChangeEmoji}
                        >
                            <FontAwesomeIcon onClick={handleToggleEmoji} icon={faFaceSmile} size='2x' style={{ cursor: 'pointer' }} />
                        </Popover>
                        <div>
                            <InputNotOutline
                                value={message}
                                placeholder='Thêm bình luận'
                                onChange={(e) => handleAddMessage(e)}
                            />
                        </div>
                    </div>
                    <div style={{ marginRight: '10px' }}>
                        <span
                            onClick={handleSubmit}
                            style={{ cursor: 'pointer', fontWeight: 'bold', color: 'rgb(18,152,247)' }}
                        >Send</span>
                    </div>
                </div>
            </div>
        </div >
    )
}
