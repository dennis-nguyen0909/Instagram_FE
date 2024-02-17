import React from 'react'
import { WrapperContainer } from './style'
import avt from '../../../src/assets/images/slider2.jpg'
import { useSelector } from 'react-redux'
export const Story = () => {
    const user = useSelector((state) => state.user)
    return (
        <WrapperContainer>
            <ul>
                <li>
                    <div className='story' style={{ backgroundColor: 'rgb(255,255,255,0.75)', padding: '1px' }}>
                        <img src={user?.avatar} width={'55px'} height={'55px'} style={{ borderRadius: '50%' }} />
                        <span className='user'>{user?.userName || user?.name}</span>
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
            </ul>
        </WrapperContainer>
    )
}
