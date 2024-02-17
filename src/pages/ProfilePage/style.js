import styled from "styled-components";

export const WrapperAvatar = styled.div`
    position: relative;
    display:flex;
    flex-direction:column;
    .avt {
        height: 180px;
        width: 180px;
        object-fit: cover;
        border-radius: 50%;

        &:hover {
            cursor: pointer;
            + .btn {
                display: block;
            }
        }
    }

    .btn {
        // display: none;
        position: absolute;
        left: 25px;
        bottom: 60px;
        width: 130px;
        background-color: #fff; /* Thêm một thuộc tính mới để kiểm tra */
    }
`;
