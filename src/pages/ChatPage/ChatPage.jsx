import { useParams } from 'react-router-dom'
import { Header } from '../../component/Header/Header'
import React, { useEffect } from 'react'
import * as UserService from '../../service/UserService'
import { useQueries, useQuery } from '@tanstack/react-query';
export default function ChatPage() {
    const params = useParams();
    const getDetailUserById = async () => {
        const res = await UserService.getDetailUserById(params.id);
        return res.response.data
    }
    const { data: userDetail } = useQuery({ queryKey: ['userDetail'], queryFn: getDetailUserById });
    console.log(userDetail)
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
            <div>
                <p>icon</p>
            </div>
            <div>
                <p>{userDetail?.userName}</p>
            </div>
        </div>
    )
}
