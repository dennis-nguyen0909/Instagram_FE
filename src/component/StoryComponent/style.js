import styled from "styled-components";

export const WrapperContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    background-color:#f9f9f9;
    margin-top:20px;
    .horizontal-scroll{
        width:600px;
        height:80px;
        background-color:#fff;
        border:1px solid #ccc;
        border-radius:5px;
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        align-items:center;
        position:relative;
        overflow:hidden;
    }
    .horizontal-scroll .btn-scroll {
        background-color:#fff;
        color:#999;
        box-shadow:0 0 10px #999;
        padding 5px 8px;
        border:0;
        border-radius:50%;
        margin:0 5px;
        z-index:999;
        cursor:pointer;
    }
    .story-container{
        display:flex;
        justify-content:flex-start;
        align-items:center;
        position:absolute;
        left:0;
        // overflow-x: auto; /* Kích hoạt thanh cuộn ngang */
        white-space: nowrap; /* Ngăn các phần tử con xuống dòng */
    }
    .story-circle {
        background:linear-gradient(rgb(231,0,231),rgb(255,115,0));
        width:60px;
        height:60px;
        margin:15px 10px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
        transform:rotateZ(45deg);
    }
    .story-circle img {
        width:52px;
        height:52px;
        border-radius:50%;
        border:2px solid #fff;
        transform:rotateZ(-45deg);

    }
`

// max-height:500px;
// overflow-y:auto;
// ul {
//     list-style-type:none;
//     user-select:none;
//     display:flex;
//     overflow-x:auto;
//     padding:20px 0;
// }

// ul li {
//     padding: 0 10px;
//     display:flex;
//     flex-direction:column;
//     align-items:center;
//     justify-content:center;
// }

// ul li:first-child {
//     padding-left:20px;
// }

// ul li:last-child {
//     padding-right:20px;
// }

// .story {
//     width:55px;
//     height:55px;
//     border-radius: 50% ;
//     background:rgb(255,255,255,0.75);
//     padding:1;
//     position:relative;
// }

// .hasStory {
//     width:55px;
//     height:55px;
//     border-radius: 50% ;
//     background:rgb(255,255,255,0.75);
//     padding:1;
//     position:relative;
//     padding:2px;
//     border-radius: 50% ;
//     background:linear-gradient(45deg,#f09443 0% ,#e6683c 25% ,#dc2743 50% , #cc2366 75% , #bc1888 100%);
// }