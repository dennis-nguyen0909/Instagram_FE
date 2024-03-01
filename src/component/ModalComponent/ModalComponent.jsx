import React, { useState } from 'react';
import { ModalOverlay, ModalContent, CloseButton, ContentWrapper } from './style'
import { Col, Row } from 'antd';
const ModalComponent = ({ isOpen, handleCancel, post }) => {

    return (
        <div>
            {isOpen && (
                <ModalOverlay>
                    <ModalContent>
                        {/* <CloseButton onClick={closeModal}>&times;</CloseButton> */}
                        <ContentWrapper>
                            <Row>
                                <Col style={{ color: 'black', backgroundColor: 'red' }} span={13}>
                                    <img src={post.images}></img>
                                </Col>
                                <Col style={{ color: 'black' }} span={10}>hhhh</Col>
                            </Row>
                        </ContentWrapper>
                    </ModalContent>
                </ModalOverlay>
            )}
        </div>
    );
}

export default ModalComponent