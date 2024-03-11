import React, { useContext, useEffect, useRef, useState } from 'react'
import * as ReelService from '../../service/ReelService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment as regularComment, faHeart, faBookmark, faFaceSmile } from '@fortawesome/free-regular-svg-icons';

import { faMusic, faVolumeOff, faVolumeXmark, faHeart as solidHeart, faComment, faShare, faBookBookmark, faEllipsis, } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Button } from 'antd'
import { Reel } from '../../component/Reel/Reel';
import { useQuery } from '@tanstack/react-query';
import { SocketContext } from '../../context/socketContext';
export const ReelPage = () => {
    const socket = useContext(SocketContext)
    const [reels, setReels] = useState([])
    const [likeReelTime, setLikeReelTime] = useState([])
    const [unLikeReelTime, setUnLikeReelTime] = useState([])
    const getAllReels = async () => {
        const res = await ReelService.getAllReel();
        return res?.response.data
        setReels(res?.response?.data)
    }

    useEffect(() => {
        getAllReels();
    }, [])
    const { data: reels2 } = useQuery({ queryKey: ['reels'], queryFn: getAllReels })
    console.log("resss", reels2)
    useEffect(() => {
        socket.on('like-reel', (msg) => {
            setLikeReelTime(msg)
            setUnLikeReelTime('')
            console.log("like", msg)
        })
        socket.on('unlike-reel', (msg) => {
            console.log("unlike", msg)
            setLikeReelTime('')
            setUnLikeReelTime(msg)
        })
    }, [])
    const uiReels = likeReelTime.length > 0 ? likeReelTime : unLikeReelTime?.length > 0 ? unLikeReelTime : reels2
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px', flexDirection: 'column', gap: '20px' }}>
            {uiReels?.map((reel, index) => {
                return (
                    // <div style={{ display: 'flex', alignItems: 'center', }}>
                    //     < div
                    //         key={index}
                    //         style={{ width: '412px', height: '732px', borderRadius: '4px', position: 'relative' }}
                    //     >
                    //         <div style={{ position: 'absolute', right: '0', cursor: 'pointer', zIndex: 10, width: '35px', height: '35px', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '5px 5px', }}>
                    //             {muted ? (

                    //                 <FontAwesomeIcon
                    //                     icon={faVolumeXmark}
                    //                     style={{ color: "#fafcff", fontSize: '24px', cursor: 'pointer' }}
                    //                     onClick={toggleMutedVideo} // Đây là sự kiện onClick chỉ được gán cho icon
                    //                 />
                    //             ) : (
                    //                 <FontAwesomeIcon
                    //                     icon={faVolumeOff}
                    //                     style={{ color: "#fafcff", fontSize: '24px', margin: '10px 10px', cursor: 'pointer' }}
                    //                     onClick={toggleMutedVideo} // Đây là sự kiện onClick chỉ được gán cho icon
                    //                 />
                    //             )}
                    //         </div>
                    //         <div style={{ position: 'absolute', bottom: '5px', left: '40px', gap: '10px', display: 'flex', flexDirection: 'column' }}>
                    //             <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
                    //                 <Avatar src={reel.userId.avatar} />
                    //                 <span style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{reel.userId.userName}
                    //                     <span style={{ color: '#fff', fontSize: '20px' }}>•</span>
                    //                 </span>
                    //                 <button style={{ backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '5px', padding: '6px 10px', color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>Theo dõi</button>
                    //             </div>
                    //             <div>
                    //                 <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{reel.caption}</p>
                    //             </div>
                    //             <div>
                    //                 <FontAwesomeIcon icon={faMusic} style={{ color: '#fff' }} />
                    //             </div>
                    //         </div>
                    //         <video

                    //             width={'100%'}
                    //             height={'100%'}
                    //             autoPlay
                    //             ref={videoRef}
                    //             onEnded={handleAutoPlay}
                    //         >
                    //             <source src={reel?.videoUrl}></source>
                    //         </video>
                    //     </div>
                    //     <div style={{ width: '100px', height: '100px', marginTop: '200px', display: 'flex', flexDirection: 'column', gap: '27px' }}>
                    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    //             <FontAwesomeIcon icon={faHeart} style={{ fontSize: '24px' }} />
                    //             <span style={{ fontSize: '12px' }}>Lượt thích</span>
                    //         </div>
                    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    //             <FontAwesomeIcon icon={regularComment} style={{ fontSize: '24px' }} />
                    //             <span style={{ fontSize: '12px' }}>216</span>
                    //         </div>
                    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    //             <FontAwesomeIcon icon={faShare} style={{ fontSize: '24px' }} />
                    //         </div>
                    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    //             <FontAwesomeIcon icon={faBookmark} style={{ fontSize: '24px' }} />
                    //         </div>

                    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    //             <FontAwesomeIcon icon={faEllipsis} style={{ fontSize: '24px' }} />
                    //         </div>
                    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    //             <img src={reel?.userId?.avatar} style={{ width: '30px', height: '30px', borderRadius: '5px' }} />
                    //         </div>

                    //     </div>
                    // </div>
                    <Reel
                        ownUser={reel?.userId?._id}
                        commentsReel={reel?.comments}
                        likes={reel?.likes}
                        key={index}
                        reel={reel}
                    />
                )
            })}
        </div >
    )
}
