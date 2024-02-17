import styled from "styled-components";

export const WrapperContainer = styled.div`
    ul {
        list-style-type:none;
        user-select:none;
        display:flex;
        overflow-y:auto;
        padding:20px 0;
    }

    ul li {
        padding: 0 10px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
    }

    ul li:first-child {
        padding-left:20px;
    }

    ul li:last-child {
        padding-right:20px;
    }

    .story {
        width:55px;
        height:55px;
        border-radius: 50% ;
        background:rgb(255,255,255,0.75);
        padding:1;
        position:relative;
    }
    
    .hasStory {
        width:55px;
        height:55px;
        border-radius: 50% ;
        background:rgb(255,255,255,0.75);
        padding:1;
        position:relative;
        padding:2px;
        border-radius: 50% ;
        background:linear-gradient(45deg,#f09443 0% ,#e6683c 25% ,#dc2743 50% , #cc2366 75% , #bc1888 100%);
    }

`