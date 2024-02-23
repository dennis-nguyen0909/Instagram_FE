import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import avt from '../../../src/assets/images/slider2.jpg'
export const AvatarComponent = ({ name, email, image, onClick, id }) => {
    return (
        <div className='story' style={{ backgroundColor: 'rgb(255,255,255,0.75)', padding: '1px', display: 'flex', cursor: 'pointer' }} onClick={onClick}>
            <img src={image} width={'45px'} height={'45px'} style={{ borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: '10px' }}>
                <span className='user' style={{ fontWeight: 'bold' }}>{email}</span>
                <span style={{ color: '#ccc' }}>{name}</span>
            </div>
        </div>
    )
}
