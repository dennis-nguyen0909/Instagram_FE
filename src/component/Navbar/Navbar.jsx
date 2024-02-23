import React, { useEffect, useState } from 'react'
import { AvatarComponent } from '../AvartarComponent/AvatarComponent'
import avt from '../../../src/assets/images/avatar.jpeg'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'
import { useQuery } from '@tanstack/react-query'
import { WrapperDivText, WrapperDivUserSuggest } from './style'
import { updateUserFollow } from '../../redux/slides/userSlice'
import { UserNavbar } from '../UserNavbar/UserNavbar'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

export const Navbar = () => {
    const currentUser = useSelector((state) => state.user)
    const navigate = useNavigate();
    const [friends, setFriends] = useState([])
    const handleGetAllUser = async () => {
        // const res = await UserService.getFriends(currentUser?.id);
        const res = await UserService.getAllUser();
        setFriends(res.response.data)
    }
    const dispatch = useDispatch()

    useEffect(() => {
        handleGetAllUser();
    }, [])



    const handleFollower = async (userId) => {
        try {
            const res = await UserService.handleFollow(userId, currentUser?.id);


            dispatch(updateUserFollow({ user: res.response.data, access_token: currentUser?.access_token }));

        } catch (error) {

        }
    }
    const handleNavigateProfile = (userName) => {
        navigate(`/${userName}`)
    }
    const [isNavigating, setIsNavigating] = useState(false);
    const handleNavigateUser = (userId) => {
        console.log(userId)
        setIsNavigating(true);
        navigate(`/profile/${userId}`, { state: { userId } });

    }
    return (
        <div style={{ marginTop: '40px', paddingRight: '100px' }}>
            <Button onClick={() => handleNavigateUser(currentUser?.id)}>AVT</Button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <AvatarComponent image={currentUser?.avatar} name={currentUser?.name} email={currentUser?.email} />
                <span style={{ color: 'rgb(0,149,246)' }}>Chuyển</span>
            </div>
            <WrapperDivText>
                <span style={{ color: 'rgb(115,115,115)', fontWeight: 'bold' }}>Bạn bè </span>
                <span style={{ fontWeight: 'bold' }}>Xem tất cả</span>
            </WrapperDivText>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {friends?.map((user, index) => {
                    return (

                        <UserNavbar

                            username={user?.userName || user?.email}
                            listUser={user}
                            key={index}
                            listFollowers={user?.followers}
                            listFollowings={user?.followings}

                        />
                    )
                })}

            </div>
        </div >
    )
}
