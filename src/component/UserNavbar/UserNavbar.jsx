import React, { useEffect, useInsertionEffect, useState } from 'react'
import { WrapperDivUserSuggest } from '../Navbar/style'
import { AvatarComponent } from '../AvartarComponent/AvatarComponent'
import avt from '../../../src/assets/images/avatar.jpeg'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'
import { updateUserFollow } from '../../redux/slides/userSlice'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
export const UserNavbar = ({ listUser, listFollowers, listFollowings, username, name }) => {
    const currentUser = useSelector((state) => state.user)
    const navigate = useNavigate()
    const handleNavigateProfile = (userName) => {

        navigate(`/${userName}`)
    }
    return (
        <>
            <WrapperDivUserSuggest onClick={() => handleNavigateProfile(username)}>
                <AvatarComponent image={listUser?.avatar || avt} name={'Gợi ý cho bạn'} email={listUser?.name || listUser?.userName} />
                <span > Theo dõi</span>

            </WrapperDivUserSuggest>
        </>
    )
}
