import styled from "styled-components";

export const WrapperDivIcon = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    gap:100px;
    font-size:18px;
    padding-bottom:20px;
    .active {
        border-top:2px solid black;
    }

`
export const WrapperPosts = styled.div`
    width: 300px;
    position: relative;
    overflow: hidden; /* Ẩn phần ngoài của pseudo-element */
    .post-img {
        transition: filter 0.3s ease; /* Thêm hiệu ứng chuyển đổi */
    }
    .post-icon {
        color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        padding: 5px;
        border-radius: 50%;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5); /* Màu đen bóng với độ mờ */
        transition: opacity 0.3s ease; /* Thêm hiệu ứng chuyển đổi */
    }
    .overlay::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black; /* Màu đen */
        opacity: 0.1; /* Bắt đầu với opacity 0 */
        transition: opacity 0.3s ease; /* Thêm hiệu ứng chuyển đổi */
    }
    &:hover .post-icon {
        opacity: 1;
        visibility: visible;
    }
    &:hover .post-img {
        filter:  brightness(70%); /* Chuyển đổi hình ảnh sang màu xám */
        cursor:pointer;
    }
    &:hover .overlay {
        opacity: 1; /* Đặt opacity của overlay khi hover */
    }
    &:hover .overlay::before {
        opacity: 0.6; /* Đặt opacity của lớp màu đen bóng khi hover */
    }
`;

