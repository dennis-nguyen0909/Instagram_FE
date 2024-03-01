import styled from 'styled-components'

export const WrapperContainer = styled.div`
    margin-left:10px;
    position:fixed;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    justify-content:space-between;
    height:100vh;

`
export const WrapperIconPicker = styled.div`

    .emoji-custom{
        width:50px;
        height:50px;
    }
`
export const NavDiv = styled.div`
    margin-bottom:200px;

    div{
        width:200px;
        padding-left:10px;
        display: flex;
        gap: 10px;
        font-size: 15px;
    }
    div:hover{
        cursor:pointer;
        background-color:rgb(229,229,229);
        border-radius:5px;
    }
    .active{
        font-weight:bold;
    }
    .active2{
        p{
            display:none;
        }
    }
    
`
export const WrapperSpan = styled.span`
    color :rgb(0,150,247);
    font-weight:bold;
    cursor:pointer;

    &:hover {
        color:black;
    }
`
export const WrapperDivSearch = styled.div`
 
    .wrapper-avatar{
        padding:3px 3px;
        &:hover{
            border-radius:5px;
            background-color:#ccc;
            cursor:pointer;
        }
    }
`