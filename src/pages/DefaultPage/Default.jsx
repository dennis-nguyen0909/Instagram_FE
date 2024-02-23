import React from 'react'
import { Header } from '../../component/Header/Header'
import { Col, Row } from 'antd';
import { Navbar } from '../../component/Navbar/Navbar';
export const Default = ({ children }) => {
    return (
        <div >
            <Row>
                <Col style={{ borderRight: '1px solid #ccc' }} span={4}>
                    <Header />
                </Col>
                <Col span={14}>{children}</Col>
                <Col span={6}>
                    <Navbar />
                </Col>
            </Row>
        </div>
    )
}
