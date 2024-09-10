import React, { useEffect, useState } from 'react'
import './login.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { Link } from '../../../public/assets/img/avt.png'
import * as UserService from '../../service/UserService'
import { Button, Input, message } from 'antd'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlice'
import { useMutationHook } from '../../hook/useMutationHook'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'

export const LoginPage = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const navigate = useNavigate()
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const mutation = useMutationHook(
        data => UserService.loginUser(data)
    )
    const { data, isSuccess, isError } = mutation
    const userLogin = data
    useEffect(() => {
        if (+userLogin?.data?.EC === 0) {
            localStorage.setItem('access_token', userLogin?.data?.access_token)
            localStorage.setItem('refresh_token', userLogin?.refresh_token)
            if (userLogin?.data?.access_token) {
                const decoded = jwtDecode(userLogin.data?.access_token);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, userLogin?.data?.access_token);
                }
            }
            if (location.state) {
                navigate(location.state)
            } else {
                navigate('/')
            }
            message.success("Login Success!")
        } else if (+userLogin?.data?.EC === 1) {
            console.log("user",userLogin)
            message.error(`${userLogin.data.EM}`)
            return;
        }
    }, [isSuccess])
    useEffect(() => {
        if (user?.access_token) {
            navigate('/')
        }
    }, [user])

    const handleGetDetailUser = async (id, accessToken) => {
        const res = await UserService.getDetailUser(id, accessToken);
        dispatch(updateUser({ ...res?.response?.data, access_token: accessToken }))

    }
    const handleLogin = () => {
        mutation.mutate({ email, password })
    }
    return (
        <>
            <div className='loginContainer' >
                <div className='loginContainerLeft '>
                    <img className="imgBackground" src='https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones-2x.png?__makehaste_cache_breaker=73SVAexZgBW' alt='DT'></img>
                </div>
                <div className='loginContainerRight'>
                    <div className='containerForm'>
                        <form className='formLogin'>
                            <div className='formOne'>
                                <h2 className='loginTitle'>Instagram</h2>
                            </div>
                            <div className='formTwo'>
                                <div className='formGroup'>
                                    <Input placeholder='Số điện thoại, tên người dùng hoặc email' onChange={onChangeEmail} />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Input onChange={(e) => onChangePassword(e)} value={password} type={showPassword ? 'text' : 'password'} placeholder='Password'></Input>
                                    <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', zIndex: '10', right: '0', paddingTop: '5px', paddingRight: '10px' }}>
                                        {showPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
                                    </span>
                                </div>

                                <div className='formGroup'>
                                    <Button onClick={handleLogin} >Đăng nhập</Button>
                                    <hr />
                                    <span>Hoặc</span>
                                </div>
                                <div className='formGroup'>
                                    <a>Đăng nhập bằng facebook</a>
                                    <a>Quên mật khẩu</a>
                                </div>
                            </div>
                        </form>
                        <div className='formThree'>
                            <span>Bạn chưa có tài khoản?
                                <a onClick={() => navigate('/sign-up')}>Đăng Ký</a>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
