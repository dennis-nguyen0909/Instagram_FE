import React from 'react'
import { Header } from '../../component/Header/Header'
import { Col, Row } from 'antd';
import { Navbar } from '../../component/Navbar/Navbar';
import { useLocation, useParams } from 'react-router-dom';
export const Default = ({ children }) => {
    const params = useParams()
    const location = useLocation(); // Lấy location hiện tại
    console.log('location', location)
    return (
        <div >
            <Row>
                <Col style={{ borderRight: '1px solid #ccc' }} span={4}>
                    <Header />
                </Col>
                {/* <Col span={14}>{children}</Col> */}
                {/* Chỉ hiển thị Navbar nếu đường dẫn không phải là /profile */}
                {location.pathname.startsWith('/profile/') ? (
                    <>
                        <Col span={20}>{children}</Col>
                    </>
                ) : (
                    <>
                        <Col span={14}>{children}</Col>
                        <Col span={6}>
                            <Navbar />
                        </Col>
                    </>
                )}
            </Row>
        </div>
    )
}
