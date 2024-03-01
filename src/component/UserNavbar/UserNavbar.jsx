import React, { useEffect, useInsertionEffect, useState } from 'react'
import { WrapperDivUserSuggest } from '../Navbar/style'
import { AvatarComponent } from '../AvartarComponent/AvatarComponent'
import avt from '../../../src/assets/images/avatar.jpeg'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'
import { updateUserFollow } from '../../redux/slides/userSlice'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { faL } from '@fortawesome/free-solid-svg-icons'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
export const UserNavbar = ({ listUser, listFollowers, listFollowings, username, name, idUser }) => {
    const currentUser = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [isFollow, setIsFollow] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleNavigateProfile = (idUser) => {

        navigate(`/profile/${idUser}`)
    }

    const handleFollow = async () => {
        setLoading(true)
        const res = await UserService.handleFollow(idUser, currentUser?.id)
        if (res.response.code === 200) {
            message.success(res.response.message)

            // query.invalidateQueries({ queryKey: ['user'], queryFn: getUserByUserName })

        } else {
            message.error(res.response.message)
        }
        setIsFollow(!isFollow)
        setLoading(false)
    }
    const handleUnFollow = async () => {
        setLoading(true)
        const res = await UserService.handleUnFollow(idUser, currentUser?.id)
        if (res.response.code === 200) {
            message.success(res.response.message)

            // query.invalidateQueries({ queryKey: ['user'], queryFn: getUserByUserName })

        } else {
            message.error(res.response.message)
        }
        setIsFollow(!isFollow)
        setLoading(false)
    }
    return (
        <>
            <WrapperDivUserSuggest>
                <AvatarComponent image={listUser?.avatar || avt} name={'Gợi ý cho bạn'} email={listUser?.name || listUser?.userName} onClick={() => handleNavigateProfile(idUser)} />
                <LoadingComponent isLoading={loading}>
                    {isFollow ? (
                        <span style={{ color: 'rgb(0,150,247)', fontWeight: 'bold', cursor: 'pointer', marginRight: '20px' }} onClick={handleUnFollow} >Hủy theo dõi</span>
                    ) : (
                        <span style={{ color: 'rgb(0,150,247)', fontWeight: 'bold', cursor: 'pointer', marginRight: '20px' }} onClick={handleFollow} >Theo dõi</span>
                    )}
                </LoadingComponent>
            </WrapperDivUserSuggest>
        </>
    )
}
