import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import * as UserService from '../../service/UserService'
import { Avatar, Button, Drawer, Image, Input, Select, message } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import avatarDefault from '../../assets/images/avatar.jpeg'
import { updateUser, resetUser } from '../../redux/slides/userSlice'
import { useRef } from 'react'
import axios from 'axios'
import { useMutationHook } from '../../hook/useMutationHook'
import { WrapperAvatar } from './style'
import { ProfileComponent } from '../../component/ProfileComponent/ProfileComponent'
export const ProfileUserOther = () => {
    const params = useParams();
    const [isFollow, setIsFollow] = useState(false)
    const user = useSelector((state) => state.user)
    const getUserByUserName = async () => {
        const res = await UserService.getDetailUserById(params.id);
        return res.response.data
    }
    const query = useQueryClient();
    const { data: userDetail } = useQuery({ queryKey: ['user'], queryFn: getUserByUserName })
    const handleFollow = async () => {
        const res = await UserService.handleFollow(userDetail._id, user?.id)
        if (res.response.code === 200) {
            message.success(res.response.message)
            query.invalidateQueries({ queryKey: ['user'], queryFn: getUserByUserName })

        } else {

            message.error(res.response.message)
        }
        setIsFollow(!isFollow)
    }
    const handleUnFollow = async () => {
        const res = await UserService.handleUnFollow(userDetail._id, user?.id)
        if (res.response.code === 200) {
            message.success(res.response.message)
            query.invalidateQueries({ queryKey: ['user'], queryFn: getUserByUserName })
        } else {
            message.error(res.response.message)
        }
        setIsFollow(!isFollow)
    }
    useEffect(() => {
        if (userDetail) {
            const checkIdExsit = userDetail?.followers.find((item) => item === user?.id)
            setIsFollow(checkIdExsit !== undefined)
        }
    }, [userDetail]);


    return (
        <>
            <ProfileComponent idUser={params.id} />
        </>
    )
}
