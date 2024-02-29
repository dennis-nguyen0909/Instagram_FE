import React, { useEffect, useRef } from 'react'
import { format } from 'timeago.js'
import { WrapperMessage } from '../ChatBox/style'

export const MessageComponent = ({ uiMessage, userDetail, user }) => {
    const scrollRef = useRef();
    useEffect(() => {
        if (scrollRef.current && scrollRef) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [uiMessage])
    return (
        <div>
            {uiMessage?.map((mess) => {
                return (
                    <div ref={scrollRef}>
                        <WrapperMessage own={mess.senderId === user.id}>
                            {mess?.senderId === user?.id ? (
                                <img src={user?.avatar} alt="User 1 Avatar" />

                            ) : (
                                <img src={userDetail?.avatar} alt="User 1 Avatar" />

                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p>{mess?.text}</p>
                                <span style={{ fontSize: '10px' }}>{format(mess.createdAt)}</span>
                            </div>
                        </WrapperMessage>
                    </div>
                )
            })}
        </div>
    )
}
