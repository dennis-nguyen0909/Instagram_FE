import { Avatar } from 'antd'
import React, { useState } from 'react'
import { format, render, cancel, register } from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';
import { AvatarComponent } from '../AvartarComponent/AvatarComponent';
import { WrapperAccount } from '../Post/style';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
export const CommentList = ({ comments, onWheel, ref, visibleComment }) => {
    const [visibleComments, setVisibleComments] = useState(visibleComment || 10);
    const navigate = useNavigate()
    const handleLoadMore = () => {
        setVisibleComments(visibleComments + 10); // Tăng số lượng phần tử hiển thị lên 10
    };
    const handleNavigateProfile = (userName) => {
        navigate(`/profile-user/${userName}`)
    }
    console.log(comments)

    return (
        <>
            {comments?.slice(0, visibleComments)?.map((comment, index) => (
                <WrapperAccount key={index} onWheel={onWheel} ref={ref}>
                    <Avatar style={{ cursor: 'pointer' }} src={comment?.postedBy?.avatar} size={'large'} onClick={() => handleNavigateProfile(comment?.postedBy?.userName)} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ fontWeight: 'bold' }}>{comment?.postedBy?.userName}</div>
                                <div style={{ fontWeight: '400' }}>{comment?.text}</div>
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgb(115,115,115)', paddingTop: '5px' }}>
                                {format(comment?.created, 'vi')}
                            </div>
                        </div>
                    </div>
                </WrapperAccount>
            ))}
            {comments.length > visibleComments && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }} >
                    <PlusCircleOutlined onClick={handleLoadMore} style={{ fontSize: '30px' }} />
                </div>
            )}
        </>
    )
}
