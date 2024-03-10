import React, { useEffect, useRef, useState } from 'react'
import * as ReelService from '../../service/ReelService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment as regularComment, faHeart, faBookmark, faFaceSmile } from '@fortawesome/free-regular-svg-icons';

import { faMusic, faVolumeOff, faVolumeXmark, faHeart as solidHeart, faComment, faShare, faBookBookmark, faEllipsis, } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button, Popover } from 'antd'
import { format, render, cancel, register } from 'timeago.js';

export const Reel = ({ reel, comments, likes }) => {
    const [muted, setMuted] = useState(false)
    const videoRef = useRef()
    const handleAutoPlay = () => {
        if (videoRef && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }
    const toggleMutedVideo = () => {
        if (videoRef && videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setMuted(!videoRef.current.muted)
        }
    }
    console.log(muted)
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const contentComment = () => {
        return (
            <div style={{ width: '300px', height: '450px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} >
                    <h3>Bình luận</h3>
                    <button
                        onClick={hide}
                        style={{ position: 'absolute', left: '0', backgroundColor: 'transparent', border: 'none', fontSize: '22px', fontWeight: '100', cursor: 'pointer' }}>X</button>
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', gap: '5px' }}>
                            <Avatar src={reel?.userId?.avatar} />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <div style={{ lineHeight: '12px' }}>
                                    <span style={{ fontWeight: '700' }}>{reel?.userId.userName}</span>
                                    <span style={{ color: '#ccc' }}>
                                        <span style={{ color: '#ccc', fontSize: '20px' }}>•</span>
                                        {format(reel.createdAt)}</span>
                                </div>
                                <span>{reel.caption}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
    useEffect(() => {
        if (videoRef.current) {
            if (videoRef.current) {
            }
        }
    }, [videoRef.current])
    return (
        <div style={{ display: 'flex', alignItems: 'center', }}>
            < div
                style={{ width: '412px', height: '732px', borderRadius: '4px', position: 'relative' }}
            >
                <div style={{ position: 'absolute', right: '0', cursor: 'pointer', zIndex: 10, width: '30px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '10px 5px', }}>
                    {muted ? (
                        <FontAwesomeIcon
                            icon={faVolumeOff}
                            style={{ color: "#fafcff", fontSize: '18px', margin: '10px 10px', cursor: 'pointer' }}
                            onClick={toggleMutedVideo} // Đây là sự kiện onClick chỉ được gán cho icon

                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faVolumeXmark}
                            style={{ color: "#fafcff", fontSize: '18px', cursor: 'pointer' }}
                            onClick={toggleMutedVideo} // Đây là sự kiện onClick chỉ được gán cho icon
                        />
                    )}
                </div>
                <div style={{ position: 'absolute', bottom: '5px', left: '40px', gap: '10px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar src={reel.userId.avatar} />
                        <span style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{reel.userId.userName}
                            <span style={{ color: '#fff', fontSize: '20px' }}>•</span>
                        </span>
                        <button style={{ backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '5px', padding: '6px 10px', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>Theo dõi</button>
                    </div>
                    <div>
                        <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{reel.caption}</p>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faMusic} style={{ color: '#fff' }} />
                    </div>
                </div>
                <video

                    width={'100%'}
                    height={'100%'}
                    autoPlay
                    muted={true}
                    ref={videoRef}
                    onEnded={handleAutoPlay}

                >
                    <source src={reel?.videoUrl}></source>
                </video>
            </div>
            <div style={{ width: '100px', height: '100px', marginTop: '200px', display: 'flex', flexDirection: 'column', gap: '27px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <FontAwesomeIcon icon={faHeart} style={{ fontSize: '24px' }} />
                    <span style={{ fontSize: '12px' }}>Lượt thích</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Popover
                        content={contentComment}
                        placement='topLeft'
                        trigger="click"
                        open={open}
                        onOpenChange={handleOpenChange}
                    >
                        <FontAwesomeIcon icon={regularComment} style={{ fontSize: '24px', cursor: 'pointer' }} />
                    </Popover>
                    <span style={{ fontSize: '12px' }}>{comments.length}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <FontAwesomeIcon icon={faShare} style={{ fontSize: '24px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <FontAwesomeIcon icon={faBookmark} style={{ fontSize: '24px' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <FontAwesomeIcon icon={faEllipsis} style={{ fontSize: '24px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <img src={reel?.userId?.avatar} style={{ width: '30px', height: '30px', borderRadius: '5px' }} />
                </div>

            </div>
        </div>
    )
}
