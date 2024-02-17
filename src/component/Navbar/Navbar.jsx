import React from 'react'
import { AvatarComponent } from '../AvartarComponent/AvatarComponent'
import avt from '../../../src/assets/images/slider2.jpg'
import { useSelector } from 'react-redux'
export const Navbar = () => {
    const user = useSelector((state) => state.user)
    return (
        <div style={{ marginTop: '40px', paddingRight: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AvatarComponent image={user?.avatar} name={user?.name} email={user?.email} />
                <span style={{ color: 'rgb(0,149,246)' }}>Chuyển</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
                <span style={{ color: 'rgb(115,115,115)', fontWeight: 'bold' }}>Gợi ý cho bạn</span>
                <span style={{ fontWeight: 'bold' }}>Xem tất cả</span>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AvatarComponent image={avt} name={'Theo dõi bạn'} email={'duyxitrum'} />
                    <span style={{ color: 'rgb(0,149,246)' }}>Theo dõi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AvatarComponent image={avt} name={'Theo dõi bạn'} email={'duyxitrum'} />
                    <span style={{ color: 'rgb(0,149,246)' }}>Theo dõi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AvatarComponent image={avt} name={'Theo dõi bạn'} email={'duyxitrum'} />
                    <span style={{ color: 'rgb(0,149,246)' }}>Theo dõi</span>
                </div>
            </div>
        </div>
    )
}
