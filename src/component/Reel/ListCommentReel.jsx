import { Avatar } from 'antd'
import React, { useEffect, useRef } from 'react'
import { format } from 'timeago.js'

export const ListCommentReel = ({ uiComments }) => {
    const scrollRef = useRef()
    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [uiComments])
    return (
        <div>
            {uiComments.map((comment) => {
                return (
                    <div ref={scrollRef} style={{ marginTop: '5px' }}>
                        <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', gap: '5px' }}>
                            <Avatar src={comment?.postedBy?.avatar} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <div style={{ lineHeight: '12px' }}>
                                    <span style={{ fontWeight: '700' }}>{comment?.postedBy?.userName}</span>
                                    <span style={{ color: '#ccc' }}>
                                        <span style={{ color: '#ccc', fontSize: '20px' }}>•</span>
                                        {format(comment?.created)}</span>
                                </div>
                                <span>{comment?.text}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
