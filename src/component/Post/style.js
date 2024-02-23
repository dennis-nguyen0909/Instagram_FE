
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from 'antd';
export const WrapperInput = styled.div`
    input:focus {
        outline:none;
    }
    
`

// Tạo một wrapper cho modal
export const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Màu nền với độ trong suốt */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:9;
`;

export const WrapperButton = styled(Button)`
    position:absolute;
    top:20px;
    right:10px;
    border:transparent;
    background-color:transparent;
    font-size:20px;
    color:white;
    font-weight:400;

    &:hover {
        color:red;
    }
    
`

// Tạo một phần nội dung modal
export const ModalContent = styled.div`
    background-color: white;
    // padding: 20px;
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    width:1270px;
    height:760px;
`;

export const WrapperModalRight = styled.div`
    display:flex;
    padding:0 10px;
    gap:15px;
    align-items:center;
    border-bottom:1px solid #ccc;
    justify-content:space-between;
`

export const WrapperIcon = styled.div`
    display:flex;
    font-size:26px;
    align-items:center;
    justify-content:space-between;
    padding-top:10px;

`
export const WrapperAccount = styled.div`
    margin:10px 0;
    display:flex;
    align-items:center;
    gap:10px;
    max-height:350px;
    overflow-y:hidden;
`

export const WrapperIconModal = styled.div`
    padding:0 10px;
    border-top:1px solid #ccc;
    
    // padding-bottom:20px;
    // padding-top:10px;
    // border-bottom:1px solid #ccc;

`
export const WrapperEditPost = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    gap:10px;
    width:100%;
    height-line:10px;

    .btn {
        cursor:pointer;

    }

    &:hover {
        border-radius:3px;
        background:#ccc;
    }
`
const scrollAnimation = keyframes`
    0% {
        transform: translateY(0%);
    }
    100% {
        transform: translateY(-100%);
    }
`;

export const WrapperComment = styled.div`
    height:450px;
    overflow-y:hidden;
    position: relative; 



`
export const InputNotOutline = styled.input`
    width:100%;
    border-top:none;
    border-bottom:none;
    border-right:none;
    border-left:none;
    height:30px;
    &:focus {
        outline:none;
    }
`