import { faMusic, faVolumeOff, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

export const ReelUser = ({ reel }) => {
    console.log(reel)
    const [muted, setMuted] = useState(false)
    const videoRef = useRef();
    const user = useSelector(state => state.user)
    const toggleMutedVideo = () => {
        if (videoRef && videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setMuted(!videoRef.current.muted);
        }
    }
    const handleAutoPlayVideo = () => {
        if (videoRef && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }
    return (
        <>
            <div>
                <div style={{ width: '412px', height: '700px', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '0', margin: '10px 30px', backgroundColor: "rgba(255, 255, 255, 0.2)", padding: '10px 10px', borderRadius: '50%', zIndex: 99 }}>
                        {muted ? (
                            <FontAwesomeIcon
                                icon={faVolumeOff}
                                onClick={toggleMutedVideo}
                                style={{ color: "#fff", cursor: 'pointer', zIndex: 99, fontSize: '18px' }} />
                        ) : (
                            <FontAwesomeIcon
                                icon={faVolumeXmark}
                                onClick={toggleMutedVideo}
                                style={{
                                    color: "#fff", cursor: 'pointer',
                                    zIndex: 99, fontSize: '18px'
                                }} />
                        )}
                    </div>
                    <div style={{ position: 'absolute', bottom: '5px', left: '40px', gap: '10px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar src={reel?.userId?.avatar} />
                            <span style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{reel.userId.userName}
                                <span style={{ color: '#fff', fontSize: '20px' }}>•</span>
                            </span>
                        </div>
                        <div>
                            <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{reel.caption}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMusic} style={{ color: '#fff' }} />
                        </div>
                    </div>
                    <video
                        ref={videoRef}
                        muted={true}
                        onEnded={handleAutoPlayVideo}
                        style={{ width: '100%', height: '100%' }} autoPlay >
                        <source src={reel?.videoUrl}></source>
                    </video>
                </div>
            </div>

        </>
    )
}
