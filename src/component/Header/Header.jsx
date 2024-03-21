import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    HomeOutlined, HomeFilled,
    MenuOutlined, SearchOutlined,
    CompassOutlined, VideoCameraOutlined, MessageFilled, CompassFilled,
    MessageOutlined, HeartOutlined, PlusSquareOutlined, PlusSquareFilled, HeartFilled, VideoCameraFilled, PlaySquareOutlined
} from '@ant-design/icons';
import axios from 'axios';
import * as PostService from '../../service/PostService'
import { Avatar, Badge, Button, Col, Drawer, Image, Input, Modal, Popover, Progress, Row, Space, Spin, message } from 'antd';
import { NavDiv, WrapperContainer, WrapperDivSearch, WrapperIconPicker, WrapperNotify, WrapperSpan } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import defaultPost from '../../assets/images/default.png'
import * as UserService from '../../service/UserService'
import * as NotifyService from '../../service/NotifyService'
import * as ChatService from '../../service/ChatService'
import * as ReelService from '../../service/ReelService'
import { AutoComplete } from 'antd';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { faFaceSmile, faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputNotOutline } from '../Post/style';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addNotify } from '../../redux/slides/notifySlice';
import { SocketContext } from '../../context/socketContext';


export const Header = () => {
    const socket = useContext(SocketContext)
    const user = useSelector((state) => state.user)
    const [searchText, setSearchText] = useState('')
    const postRef = useRef()
    const [descPost, setDescPost] = useState('')
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [post, setPost] = useState([])
    const [roomChats, setRoomChats] = useState([])
    const [notify, setNotify] = useState('')
    const [messageRealTime, setMessageRealTime] = useState(0)
    const [currentSteps, setCurrentSteps] = useState('chooseFile')
    const [displayEmoji, setDisplayEmoji] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userSearch, setUserSearch] = useState([])
    const [dataSource, setDataSource] = useState([]);
    const [notifications, setNotifications] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [video, setVideo] = useState('')
    const dispatch = useDispatch()

    const handleToggleEmoji = () => {
        setDisplayEmoji(!displayEmoji)
    }
    const [openEmoji, setOpenEmoji] = useState(false);
    const hide = () => {
        setOpenEmoji(false);
    };
    const handleOpenChangeEmoji = (newOpen) => {
        setOpenEmoji(newOpen);
    };
    const handleEmojiClick = (e) => {
        setDescPost(descPost + e.native);
    };
    const getAllReels = async () => {
        const res = await ReelService.getAllReel();
        return res?.response.data
    }
    const query = useQueryClient()
    const { data: reels2, refetch } = useQuery({ queryKey: ['reels'], queryFn: getAllReels })
    useEffect(() => {
        refetch();
    }, [refetch])
    const getAllNotificationById = async () => {
        const res = await NotifyService.getAllNotifyById(user?.id);
        if (res?.response?.EC === 0) {
            setNotifications(res?.response?.data)
        } else {
            console.log('Error')
        }
    }
    console.log("notifications", notifications)
    useEffect(() => {
        getAllNotificationById();
    }, [])
    const ComponentEmoji = () => {
        return (
            <>
                <WrapperIconPicker >
                    <Picker data={data} onEmojiSelect={handleEmojiClick} className='emoji-custom' />
                </WrapperIconPicker>
            </>
        )
    }
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const onClose2 = () => {
        setOpen2(false);
        setNotifyRealTime([])
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setPost('')
        setDescPost('')
        setCurrentSteps('chooseFile')
    };
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState(null)
    const handleCreateNotify = async (data) => {
        const res = await NotifyService.createNotify(data);

    }
    const location = useLocation()
    useEffect(() => {
        if (location.pathname === '/') {
            handleItemClick('home')
        }
    }, [location])
    const onChangeDescPost = (e) => {
        setDescPost(e.target.value)
    }
    const searchUser = async () => {
        const filter = searchText;
        const res = await UserService.getAllUser(filter);

        // Kiểm tra xem dữ liệu trả về có tồn tại không
        if (res && res.response && res.response.data) {
            const users = res.response.data;

            // Kiểm tra xem trong danh sách kết quả tìm kiếm có người dùng nào khác với người dùng hiện tại không
            const userExists = users.some(item => item._id !== user?.id);
            if (userExists) {
                setUserSearch(users);
            }
        } else {
            console.error("Invalid response data:", res?.response?.data);
        }
    };
    const handleSearch = async (value) => {
        await searchUser();
    }
    const [notifyRealTime, setNotifyRealTime] = useState([])
    useEffect(() => {
        socket.on('new-message', newMessage => {
            setMessageRealTime((prev) => prev + 1)
        })
        socket.on('new-notify-like', (data) => {
            const sender = data?.userId.userName;
            const receiver = data?.ownerId.userName;
            const message = data?.message
            socket.emit("notifications", { sender, receiver, message });
        });
        socket.on('getNotifications', (data) => {
            message.success(data.message)
            setNotifyRealTime((prev) => [...prev, data])
        })
    }, [])
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };
    useEffect(() => {
        if (activeItem === 'AVT') {
            navigate(`/profile/${user.id}`);
        } else if (activeItem === 'search') {
            setOpen(true)
        } else if (activeItem === 'home') {
            navigate('/')
        } else if (activeItem === 'create') {
            showModal()
        } else if (activeItem === 'notify') {
            setOpen2(true)
        } else if (activeItem === 'message') {
            navigate(`/direct/inbox`)
        } else if (activeItem === 'reels') {
            navigate('/reels');
        } else {
            navigate('/')
        }
    }, [activeItem]);
    const handleCreatePost = async () => {
        if (video) {
            const res = await ReelService.createReel({ userId: user?.id, caption: descPost, videoUrl: video })
            if (+res.response.EC === 0) {
                await getAllPost();
                message.success("Create reels is success!!")
                setIsModalOpen(false);
                refetch();

            } else {
                message.error("Có lỗi");
                setIsModalOpen(true);
            }

        } else {
            const res = await PostService.createPost({ id: user?.id, desc: descPost, images: post })
            if (+res.response.EC === 0) {
                await getAllPost();
                message.success("Create post is success!!")
                setIsModalOpen(false);

            } else {
                message.error("Có lỗi");
                setIsModalOpen(true);
            }
        }

    }
    const handleSelectedPic = () => {
        if (postRef.current && postRef) {
            postRef.current.click()
        }
    }
    const handleOpenDrawer = () => {
        setOpen(true)
    }

    const renderModal = () => {
        if (currentSteps === 'chooseFile') {
            return modalChooseFile();
        } else if (currentSteps === 'reviewImage') {
            return modalReviewImage();
        } else if (currentSteps === 'createPost') {
            return modalCreatePost();
        }
    }
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const handleImageChangeIndex = (index) => {
        setCurrentImageIndex(index)
    }
    const modalReviewImage = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div style={{ width: '100%' }}>
                        {post?.length > 1 && !video ? (
                            <div style={{ position: 'relative' }}>
                                <Image src={post[currentImageIndex]} style={{ borderRadius: '3px' }} width={'100%'} height={'468px'} preview={false} />
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '20px', left: '0', width: '100%', gap: '10px' }}>
                                    {post.map((_, index) => (
                                        <span key={index} style={{ color: index === currentImageIndex ? '#fff' : '#ccc', cursor: 'pointer', fontSize: '30px' }}
                                            onClick={() => handleImageChangeIndex(index)}>•</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {video ? (
                                    <video controls style={{ borderRadius: '3px' }} width={'100%'} height={'468px'} autoPlay  >
                                        <source src={video}></source>
                                    </video>
                                ) : (
                                    <Image src={video ? video : post} style={{ borderRadius: '3px' }} width={'100%'} height={'468px'} preview={false} />
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: "flex-end" }} >
                    <span
                        onClick={() => setCurrentSteps('createPost')}
                        style={{ color: 'rgb(0,150,247)', fontWeight: 'bold', cursor: 'pointer', }}>
                        Tiếp</span>
                </div>
            </div>
        )
    }
    const handleFileChange = (event) => {

        const files = Array.from(event.target.files); // Chuyển đổi FileList thành mảng
        setSelectedFiles([...selectedFiles, ...files]); // Thêm các file vào selectedFiles
    }
    const [progress, setProgress] = useState(({ started: false, pc: 0 }))
    const [msg, setMsg] = useState('')
    const [uploadPercent, setUploadPercent] = useState(0)
    const [loadingUpload, setLoadingUpload] = useState(false)
    const handleFileUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setMsg("No file selected!");
            return;
        }
        if (selectedFiles[0]?.type.startsWith('video')) {
            const formData = new FormData()
            formData.append(`video`, selectedFiles[0])
            setMsg("Loading....")
            await axios.post("http://localhost:8080/api/post/upload-videos", formData, {
                headers: {
                    "Custom-Header": "value"
                }
            }).then((res) => {
                console.log("RES", res)
                setMsg("Upload successfully!!")
                const uploadImage = res?.data?.response?.data?.url
                setVideo(uploadImage);
                setLoadingUpload(false)
                setCurrentSteps("reviewImage")

            }).catch((err) => {
                setMsg("Upload failed!!")
                setLoadingUpload(false)

            })
        } else {
            const formData = new FormData();
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append(`image`, selectedFiles[i])
            }
            setMsg("...Uploading....")
            setLoadingUpload(true)
            setProgress(pre => {
                return { ...pre, started: true }
            })

            axios.post("http://localhost:8080/api/post/upload-images", formData, {
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadPercent(percentage);
                    setProgress(pre => {
                        return { ...pre, pc: progressEvent.progress * 100 }
                    })
                },
                headers: {
                    "Custom-Header": "value"
                }
            }).then((res) => {
                setMsg("Upload successfully!!")
                const uploadImage = res?.data.response?.data.map((item) => item.url)
                setPost(uploadImage);
                setLoadingUpload(false)
                setCurrentSteps("reviewImage")

            }).catch((err) => {
                setMsg("Upload failed!!")
                setLoadingUpload(false)

            })
        }

    }
    const modalChooseFile = () => {
        return (
            <LoadingComponent isLoading={loadingUpload}>
                <div style={{ display: 'flex', gap: '20px', height: '500px', width: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: '100px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: '50px' }}>
                                <PlaySquareOutlined />
                                <FontAwesomeIcon icon={faImage} />
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Chọn ảnh từ máy tính</div>
                            <Button
                                onClick={handleSelectedPic}
                                style={{ backgroundColor: 'rgb(0,150,247)', color: '#fff', fontWeight: 'bold', marginTop: '30px' }}
                            >Chọn từ máy tính</Button>
                            <input type='file' multiple
                                onChange={handleFileChange}
                                ref={postRef} style={{ display: 'none' }} />

                            {selectedFiles.length > 0 &&
                                <button style={{ marginTop: '10px' }} onClick={handleFileUpload}>Upload</button>
                            }
                            {/* {loadingUpload === true ? <Spin></Spin> : <></>} */}


                        </div>
                    </div>

                </div>
            </LoadingComponent>
            // <div>
            //     <input type="file" onChange={handleFileChange} multiple />
            //     <button onClick={handleFileUpload}>Upload</button>
            //     {progress.started && <progress max={'100'} value={progress.pc}></progress>}
            //     {msg && <span>{msg}</span>}
            // </div>
        )
    }
    const modalCreatePost = () => {
        return (
            <div style={{ borderTop: '1px solid #ccc' }}>
                <div style={{ display: 'flex', maxHeight: '700px' }}>
                    <div style={{ height: '594px', width: '580px' }} >
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '10px', maxWidth: '700px' }}>
                            {post?.length > 1 ? (
                                <div style={{ position: 'relative' }}>
                                    <Image src={post[currentImageIndex]} style={{ borderRadius: '3px' }} width={'594px'} height={'594px'} preview={false} />
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '20px', left: '0', width: '100%', gap: '10px' }}>
                                        {post.map((_, index) => (
                                            <span key={index} style={{ color: index === currentImageIndex ? '#fff' : '#ccc', cursor: 'pointer', fontSize: '30px' }}
                                                onClick={() => handleImageChangeIndex(index)}>•</span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {video ? (
                                        <video controls style={{ borderRadius: '3px' }} width={'100%'} height={'594px'} autoPlay  >
                                            <source src={video}></source>
                                        </video>
                                    ) : (
                                        <Image src={post} style={{ borderRadius: '3px' }} width={'594px'} height={'594px'} preview={false} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc', }}>
                        <div style={{ display: 'flex', marginLeft: '10px', gap: '10px', alignItems: 'center' }}>
                            <Image src={user?.avatar} preview={false} width={'40px'} height={'40px'} style={{ borderRadius: '50%' }} />
                            <p style={{ fontWeight: 'bold' }}>{user?.userName || user.name}</p>
                        </div>
                        <div style={{
                            marginLeft: '10px',
                            fontWeight: '800',
                        }}>
                            <textarea
                                style={{ height: '200px', width: '300px', fontSize: '18px', overflow: 'hidden', border: 'none', resize: 'none', outline: 'none' }}
                                value={descPost}
                                onChange={(e) => onChangeDescPost(e)}
                                placeholder='Viết chú thích'
                            />
                            <div style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                                <Popover
                                    content={ComponentEmoji}
                                    title="Emoji"
                                    trigger="click"
                                    open={openEmoji}
                                    onOpenChange={handleOpenChangeEmoji}

                                >
                                    <FontAwesomeIcon onClick={handleToggleEmoji} icon={faFaceSmile} size='2x' style={{ cursor: 'pointer' }} />
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <WrapperSpan
                        onClick={handleCreatePost}>Chia sẻ</WrapperSpan>
                </div>
            </div>
        )
    }
    const getChat = async () => {
        const res = await ChatService.getChat(user?.id);
        setRoomChats(res?.response.data);
    }
    const getAllPost = async () => {
        const res = await PostService.getAllPost();
        return res.response.data;
    }
    useEffect(() => {
        getChat()
    }, [])
    const handleNavigateUserSearch = (item) => {
        navigate(`/profile-user/${item?._id}`)
        setOpen(false)
        setSearchText('')
    }
    const displayNotify = ({ sender, message }) => {
        console.log("sender", sender, message)
        return (
            <span>{`${sender}+ ${message}`}</span>
        )
    }
    return (
        <WrapperContainer>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '30px', paddingLeft: '10px' }}>
                <h2 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Instagram</h2>
            </div>
            <NavDiv>
                <div onClick={() => handleItemClick('home')} className={activeItem === 'home' ? 'active' : ''}>
                    {activeItem === 'home' ? <HomeFilled /> : <HomeOutlined />}
                    <p>Trang chủ</p>
                </div>
                <div onClick={() => handleItemClick('search')} className={activeItem === 'search' ? 'active' : ''}>
                    {activeItem === 'search' ? <SearchOutlined /> : <SearchOutlined />}

                    <p>Tìm kiếm</p>
                </div>
                <div onClick={() => handleItemClick('discovery')} className={activeItem === 'discovery' ? 'active' : ''}>
                    {activeItem === 'discovery' ? <CompassFilled /> : <CompassOutlined />}

                    <p>Khám phá</p>
                </div>
                <div onClick={() => handleItemClick('reels')} className={activeItem === 'reels' ? 'active' : ''}>
                    {activeItem === 'reels' ? <VideoCameraFilled /> : <VideoCameraOutlined />}

                    <p>Reels </p>
                </div>
                <div onClick={() => handleItemClick('message')} className={activeItem === 'message' ? 'active' : ''}>
                    {activeItem === 'message' ?
                        (
                            // <Badge>
                            <MessageFilled />
                            // </Badge>
                        )
                        : (
                            <>
                                {/* <Badge style={{ fontSize: '10px', display: 'flex' }} count={messageRealTime} size='small'> */}
                                < MessageOutlined />
                                <p>Tin nhắn</p>
                                {/* </Badge> */}
                            </>

                        )}
                    {/* <Space size="large">
                        <Badge count={99}>
                            <MessageOutlined shape="square" size="large" />
                        </Badge>
                        <p>Tin nhắn</p>
                    </Space> */}

                </div>
                <div onClick={() => handleItemClick('notify')} className={activeItem === 'notify' ? 'active' : ''} >
                    {activeItem === 'notify' ? <HeartFilled /> : <HeartOutlined />}
                    <p>{notifyRealTime.length}Thông báo</p>
                </div>
                <div onClick={() => handleItemClick('create')} className={activeItem === 'create' ? 'active' : ''}>
                    {activeItem === 'create' ? <PlusSquareFilled /> : <PlusSquareOutlined />}
                    <p>Tạo</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleItemClick('AVT')} className={activeItem === 'AVT' ? 'active' : ''}>
                    <img src={user?.avatar} style={{ width: '25px', height: '25px', borderRadius: '50%' }}></img>
                    <p style={{ right: '5' }}>Trang cá nhân</p>
                </div>
            </NavDiv>
            <div style={{ display: 'flex', gap: '10px', fontSize: '18px', paddingLeft: '10px', marginBottom: '10px' }}>
                <MenuOutlined />
                <p>Xem thêm</p>
            </div>
            <Drawer style={{ marginLeft: '70px' }} title="Search" placement="left" onClose={onClose} open={open}>
                <div style={{ marginBottom: '40px' }} >
                    <h2>Search</h2>
                    <Input placeholder="search" onChange={(e) => setSearchText(e.target.value)} />
                    <p style={{ color: 'red' }} onClick={handleSearch}>Tìm kiếm</p>
                    {/* <AutoComplete
                        style={{ width: 200 }}
                        dataSource={dataSource}
                        placeholder="Search users"
                        onSearch={handleSearch}
                    >
                    </AutoComplete> */}
                    <WrapperDivSearch>
                        {userSearch ? userSearch?.map((item) => {
                            return (
                                <div className='wrapper-avatar' style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }} onClick={() => handleNavigateUserSearch(item)}>
                                    <Avatar src={item.avatar} size={'large'} />
                                    <span style={{ fontSize: '14px' }}>{item?.userName || item?.name || item?.email}</span>
                                </div>
                            )
                        }) : (
                            <>
                                Không thấy
                            </>)}
                    </WrapperDivSearch>
                </div>
                <div style={{ borderTop: '1px solid #ccc' }}>
                    <h2> recent
                    </h2>

                </div>
            </Drawer>
            {/* <Modal
                footer={null}
                title="Tạo bài viết"
                width={800} open={isModalOpen}
                onOk={handleOk} onCancel={handleCancel}>
                <div style={{ display: 'flex', gap: '20px', maxHeight: '500px' }}>
                    <div style={{ height: '500px', width: '500px' }} >
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>

                            <Button onClick={handleSelectedPic}>Chọn ảnh từ máy tính</Button>
                            {post ? (<Image src={post} preview={false} style={{ width: '400px', height: '500px', maxWidth: '400px', maxHeight: '500px' }} />) : <Image src={defaultPost} preview={false} />}

                            <input type='file' accept='image/*'
                                onChange={(e) => uploadPost(e.target.files[0])}
                                ref={postRef} style={{ display: 'none' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', marginLeft: '10px', gap: '10px', alignItems: 'center' }}>
                            <Image src={user?.avatar} preview={false} width={'40px'} height={'40px'} style={{ borderRadius: '50%' }} />
                            <p style={{ fontWeight: 'bold' }}>{user?.userName || user.name}</p>
                        </div>
                        <div style={{ marginLeft: '10px' }}>
                            <Input value={descPost} onChange={(e) => onChangeDescPost(e)} placeholder='Viết chú thích' width={'100%'} style={{ border: 'transparent', outline: 'none' }} />
                        </div>
                    </div>
                    <Button onClick={handleCreatePost}>Create</Button>
                </div>
            </Modal> */}

            <Modal
                footer={null}
                title="Tạo bài viết"
                width={currentSteps === "createPost" ? 950 : 650} open={isModalOpen}

                onOk={handleOk} onCancel={handleCancel}>
                {renderModal()}
            </Modal>
            <Drawer style={{ marginLeft: '180px' }} title="Thông báo" placement='left' onClose={onClose2} open={open2}>
                <h1 style={{ fontSize: '16px' }}>Hôm nay</h1>
                <div style={{ borderTop: '1px solid #ccc' }}>
                    {notifyRealTime?.map((notify) => displayNotify(notify))}
                </div>
            </Drawer>


        </WrapperContainer >
    )
}
