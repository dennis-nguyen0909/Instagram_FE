import React, { useEffect, useState } from 'react'
import { WrapperContainer } from './style'
import avt from '../../../src/assets/images/slider2.jpg'
import { useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'
import { Button } from 'antd'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
export const Story = ({ onlineUsers }) => {
    const user = useSelector((state) => state.user)
    const [allUser, setAllUser] = useState([])
    const getAllUser = async () => {
        const res = UserService.getAllUser()
            .then((result) => {

                setAllUser(result.response.data);
            })
    }
    useEffect(() => {
        getAllUser();
    }, [])
    const scroll = (direction) => {
        const scrollAmount = 320;
        const sCont = document.querySelector('.story-container');
        const currentScrollPosition = sCont.scrollLeft;
        const newScrollPosition = currentScrollPosition + (direction * scrollAmount);
        sCont.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth'
        });
    };
    return (
        <WrapperContainer style={{ overflowX: 'auto' }}>


            <div className='horizontal-scroll'>
                <div className='btn-scroll'>
                    <LeftOutlined style={{ fontSize: '18px', padding: '3px 3px' }} onClick={() => scroll(-1)} />
                    <button onClick={() => scroll(-1)}>^</button>
                </div>
                <div className='btn-scroll'>
                    <RightOutlined style={{ fontSize: '18px', padding: '3px 3px' }} onClick={() => scroll(1)} />
                    <button onClick={() => scroll(1)}>^</button>
                </div>
                <div className='story-container' style={{ backgroundColor: 'rgb(255,255,255,0.75)', padding: '1px' }}>
                    {allUser.map((user, index) => {

                        return (
                            <div className='story-circle' key={index}>
                                <img src={user?.avatar} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                                {/* <span className='user'>{user?.userName || user?.name}</span> */}

                            </div>
                        )
                    })}
                </div>
            </div>


            {/* <li>
                <div className='hasStory'>
                    <img src={avt} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                    <span className='user'>HnimYou</span>
                </div>
            </li> */}
            {/* <li>
                    <div className='hasStory'>
                        <img src={avt} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                        <span className='user'>HnimYou</span>
                    </div>
                </li>
                <li>
                    <div className='hasStory'>
                        <img src={avt} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                        <span className='user'>HnimYou</span>
                    </div>
                </li>
                <li>
                    <div className='hasStory'>
                        <img src={avt} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                        <span className='user'>HnimYou</span>
                    </div>
                </li>
                <li>
                    <div className='hasStory'>
                        <img src={avt} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                        <span className='user'>HnimYou</span>
                    </div>
                </li>
                <li>
                    <div className='hasStory'>
                        <img src={avt} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                        <span className='user'>HnimYou</span>
                    </div>
                </li>
                <li>
                    <div className='hasStory'>
                        <img src={avt} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                        <span className='user'>HnimYou</span>
                    </div>
                </li> */}

        </WrapperContainer>
    )
}
