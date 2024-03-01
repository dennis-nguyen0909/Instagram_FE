import styled from 'styled-components';
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Màu đen xám với độ mờ */
    z-index: 1000; /* Đảm bảo modal-overlay nằm trên tất cả các phần tử khác */
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ModalContent = styled.div`export
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    z-index: 1001; /* Đảm bảo modal nằm trên modal-overlay */
`;

export const CloseButton = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
`;
export const ContentWrapper = styled.div`
    background-color:#fff;
    width:1100px;
    height:90vh;
    color: #fff; /* Thiết lập màu chữ cho nội dung modal */
`;
