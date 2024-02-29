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
export const NavDiv = styled.div`
    margin-bottom:200px;

    div{
        width:200px;
        padding-left:10px;
        display: flex;
        gap: 10px;
        font-size: 18px;
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