import styled from "styled-components";

export const WrapperMessage = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 0 20px;
    justify-content: ${({ own }) => (own ? 'flex-end' : 'flex-start')};

    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    p {
        background-color: ${({ own }) => (own ? 'rgb(18,152,247)' : '#f0f0f0')};
        color :${({ own }) => (own ? '#fff' : 'black')};
        font-weight:bold;
        padding: 5px 20px;
        border-radius: 10px;
    }
`;
