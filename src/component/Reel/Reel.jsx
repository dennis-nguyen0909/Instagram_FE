import React, { useContext, useEffect, useRef, useState } from 'react'
import * as ReelService from '../../service/ReelService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment as regularComment, faHeart, faBookmark, faFaceSmile } from '@fortawesome/free-regular-svg-icons';

import { faMusic, faVolumeOff, faVolumeXmark, faHeart as solidHeart, faComment, faShare, faBookBookmark, faEllipsis, } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button, Input, Popover } from 'antd'
import { format, render, cancel, register } from 'timeago.js';
import { useSelector } from 'react-redux';
import { WrapperInput } from './style';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { CommentList } from '../CommentList/CommentList';
import { List } from 'antd/es/form/Form';
import { ListCommentReel } from './ListCommentReel';
import { SocketContext } from '../../context/socketContext';
export const Reel = ({ reel, likes, ownUser, commentsReel }) => {
    const socket = useContext(SocketContext)

    const [muted, setMuted] = useState(false)
    const [isOwnReel, setIsOwnReel] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const videoRef = useRef()
    const user = useSelector(state => state.user)
    const [displayEmoji, setDisplayEmoji] = useState(false)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState(commentsReel)
    const [commentsRealTime, setCommentsRealTime] = useState([])
    const handleToggleEmoji = () => {
        setDisplayEmoji(!displayEmoji)
    }
    const [openEmoji, setOpenEmoji] = useState(false);
    const hideEmoji = () => {
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

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            const res = await ReelService.handleCommentPost(user?.id, reel?._id, comment)
            if (res?.response.code === 200) {
                setComment('')
            }
        }
    }
    useEffect(() => {
        socket.on('new-comment', (msg) => {
            setCommentsRealTime(msg)
        })
    }, [])
    const uiComments = commentsRealTime.length > 0 ? commentsRealTime : comments
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
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    useEffect(() => {
        if (user?.id === ownUser) {
            setIsOwnReel(!isOwnReel)
        }
    }, [])
    const checkUserCurrentIsLike = likes.find((item) => item?._id === user.id)
    useEffect(() => {
        if (checkUserCurrentIsLike !== undefined) {
            setIsLike(true)
        } else {
            setIsLike(false)
        }
    }, [checkUserCurrentIsLike])

    const contentComment = () => {
        return (
            <div style={{ width: '300px', height: '450px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} >
                    <h3>Bình luận</h3>
                    <button
                        onClick={hide}
                        style={{ position: 'absolute', left: '0', backgroundColor: 'transparent', border: 'none', fontSize: '22px', fontWeight: '100', cursor: 'pointer' }}>X</button>
                </div>
                <div style={{ maxHeight: '347px', overflow: 'hidden', overflowY: 'auto' }}>
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
                        <div>
                            <ListCommentReel uiComments={uiComments} />
                        </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', width: '100%', borderRadius: '25px', padding: '5px 0', border: '1px solid #ccc' }}>
                        <div style={{ marginLeft: '5px', display: 'flex', alignItems: 'center' }}>
                            <Avatar src={user?.avatar} />
                            <WrapperInput
                                placeholder='Thêm bình luận' value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={handleKeyDown} />
                            <Popover
                                content={ComponentEmoji}
                                title="Emoji"
                                trigger="click"
                                open={openEmoji}
                                onOpenChange={handleOpenChangeEmoji}
                            >
                                <FontAwesomeIcon onClick={handleToggleEmoji} icon={faFaceSmile} size='2x' style={{ cursor: 'pointer' }} />
                            </Popover>
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
    const handleLikeReel = async () => {
        const res = await ReelService.handleLikeReel(user?.id, reel?._id);
        if (res?.response.code === 200) {
            setIsLike(!isLike)
        } else {

        }
    }
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
                        {isOwnReel ? (
                            <></>
                        ) : (
                            <button style={{ backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '5px', padding: '6px 10px', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>Theo dõi</button>
                        )}
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
                    {isLike ? (
                        <FontAwesomeIcon icon={solidHeart} style={{ fontSize: '24px', color: 'red', cursor: 'pointer' }} onClick={handleLikeReel} />

                    ) : (
                        <FontAwesomeIcon icon={faHeart} style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleLikeReel} />
                    )}
                    <span style={{ fontSize: '12px' }}>{likes.length}Lượt thích</span>
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
                    <span style={{ fontSize: '12px' }}>{uiComments.length}</span>
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
