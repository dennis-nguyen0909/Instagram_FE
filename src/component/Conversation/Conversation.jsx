import React, { useEffect, useState } from 'react'
import * as UserService from '../../service/UserService'
import * as MessageService from '../../service/MessageService'
import { useSelector } from 'react-redux'
export const Conversation = ({ data, currentUser, uiMessage, currentChat }) => {
    const [user, setUser] = useState(null)
    const userCurrent = useSelector((state) => state.user)
    const [latestMessage, setLatestMessage] = useState([])
    useEffect(() => {
        const friendsId = data.members.find(member => member !== currentUser.id)
        const getUserId = async () => {
            const res = await UserService.getDetailUserById(friendsId);
            setUser(res?.response?.data)
        }
        getUserId();
    }, [currentUser, data])
    // console.log(uiMessage?.filter((item) => item.senderId !== user?.id))
    useEffect(() => {
        if (uiMessage.length > 0) {
            const lasted = uiMessage[uiMessage.length - 1]
            setLatestMessage(lasted)
        }
    }, [latestMessage])
    return (
        <>
            <div style={{ display: 'flex', padding: '0 15px', gap: '10px', alignItems: 'center' }}>
                <div>
                    <img src={user?.avatar} style={{ width: '55px', height: '55px', borderRadius: '50%' }} />
                </div>
                <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.userName}</p>
                    <p style={{ fontSize: '10px', color: 'rgb(115,115,115)' }}>{latestMessage}
                        <span>  . 4 tuần</span>
                    </p>
                </div>
            </div>
        </>
    )
}
