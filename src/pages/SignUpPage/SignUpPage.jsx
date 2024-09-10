import { Button, DatePicker, Divider, Input, Popover, message } from 'antd'
import React, { useState } from 'react'
import { WrapperDiv, WrapperDiv2 } from './style'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import Password from 'antd/es/input/Password'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../service/UserService'
import { Select, Space } from 'antd';
export const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [idUser, setIdUser] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const [birthdate, setBirthdate] = useState('')
    const [verifyCode, setVerifyCode] = useState('')
    const [verify, setVerify] = useState('')
    const [currentStep, setCurrentStep] = useState('register');
    const navigate = useNavigate();
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleOnChangeFullName = (e) => {
        setFullName(e.target.value)
    }
    const handleOnChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleOnChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleOnChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }
    const handleRegister = async () => {
        const res = await UserService.registerUser(email, fullName, userName, password, confirmPassword);
        if (+res.response.EC === 0) {
            // setRegisterSuccess(true)
            setIdUser(res.response.DT._id)
            setCurrentStep('birthday')
        }else{
            message.error(res.response.EM)
        }
    }
    const updateUserBirthday = async () => {
        const res = await UserService.updateBirthday(birthdate, idUser);
        return res
    }
    const handleNext = async () => {
        await updateUserBirthday()
        const res = await UserService.sendMailAuth(email);
        setVerifyCode(res.response.authRandomOne)
        setCurrentStep('verify')

    }
    const handleReturn = () => {
        setRegisterSuccess(false)
    }
    const handleOnChangeVerify = (e) => {
        setVerify(e.target.value)
    }
    const renderForm = () => {
        if (currentStep === 'register') {
            return renderFormRegister();
        } else if (currentStep === 'birthday') {
            return renderFormBirthday();
        } else if (currentStep === 'verify') {
            return renderFormVerifyAuth();
        }
    };
    const handleVerifyAuth = () => {
        if (verify === verifyCode) {
            navigate('/login')
            
        } else {
            message.success('Không chính xác')
        }
    }
    const renderFormVerifyAuth = () => {
        return (
            <>
                <WrapperDiv>
                    <WrapperDiv2>
                        <h1>Instagram</h1>
                        <h4>Nhập mã xác thực</h4>
                        <p>Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ {email} </p>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                            <Input onChange={(e) => handleOnChangeVerify(e)} value={verify} placeholder='Mã xác thuc'></Input>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            <Button onClick={handleVerifyAuth} style={{ width: '100%', color: '#fff', fontWeight: 'bold', backgroundColor: 'rgb(103,181,250)', height: '35px' }}>Tiep theo</Button>
                            <Button onClick={handleReturn} style={{ width: '100%', color: 'rgb(103,181,250)', fontWeight: 'bold', backgroundColor: '#fff', height: '35px' }}>Quay lại</Button>
                        </div>
                    </WrapperDiv2>
                    <div style={{ border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px', margin: '50px 0' }}>
                        <p> Bạn đã có tài khoản? </p>
                        <p onClick={() => navigate('/login')} style={{ color: 'rgb(0,149,246)', fontWeight: 'bold', cursor: 'pointer' }}> Đăng nhập</p>
                    </div>
                </WrapperDiv ></>
        )
    }
    const renderFormRegister = () => {
        return (
            <WrapperDiv>
                <WrapperDiv2>
                    <h1>Instagram</h1>
                    <h4>Đăng ký để xem ảnh và video từ bạn bè.</h4>
                    <Button> Đăng nhập bằng facebook</Button>
                    <div>
                        <Divider>Hoặc</Divider>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                        <Input onChange={(e) => handleOnChangeEmail(e)} value={email} type='text' placeholder='Phone or email'></Input>
                        <Input onChange={(e) => handleOnChangeFullName(e)} value={fullName} type='text' placeholder='Full name'></Input>
                        <Input onChange={(e) => handleOnChangeUserName(e)} value={userName} type='text' placeholder='Name user'></Input>
                        <div style={{ position: 'relative' }}>
                            <Input onChange={(e) => handleOnChangePassword(e)} value={password} type={showPassword ? 'password' : 'text'} placeholder='Password'></Input>
                            <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', zIndex: '10', right: '0', paddingTop: '5px', paddingRight: '10px' }}>
                                {showPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
                            </span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Input onChange={(e) => handleOnChangeConfirmPassword(e)} value={confirmPassword} type={showConfirmPassword ? 'password' : 'text'} placeholder='Password'></Input>
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', zIndex: '10', right: '0', paddingTop: '5px', paddingRight: '10px' }}>
                                {showConfirmPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgb(115,115,115)' }}>Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Instagram.</p>
                    </div>
                    <div>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgb(115,115,115)' }}>Bằng cách đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi.</p>
                    </div>


                    <Button onClick={handleRegister} style={{ width: '100%', color: '#fff', fontWeight: 'bold', backgroundColor: 'rgb(103,181,250)', height: '35px' }}>Đăng ký</Button>
                </WrapperDiv2>
                <div style={{ border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px', margin: '50px 0' }}>
                    <p> Bạn đã có tài khoản? </p>
                    <p onClick={() => navigate('/login')} style={{ color: 'rgb(0,149,246)', fontWeight: 'bold', cursor: 'pointer' }}> Đăng nhập</p>
                </div>
            </WrapperDiv >
        )
    }
    const renderFormBirthday = () => {
        return (
            <>
                <WrapperDiv>
                    <WrapperDiv2>
                        <h1>Instagram</h1>
                        <h4>Thêm ngày sinh</h4>
                        <p>Thông tin này sẽ không hiển thị trên trang cá nhân công khai của bạn.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                            <DatePicker
                                mode="date"
                                placeholder="Select your birthdate"
                                onChange={(date, dateString) => setBirthdate(dateString)}
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                        <div>
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgb(115,115,115)' }}>Bạn cần nhập ngày sinh của mình</p>
                        </div>
                        <div >
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgb(115,115,115)' }}>Hãy thêm ngày sinh của chính bạn, dù đây là tài khoản dành cho doanh nghiệp, thú cưng hay bất cứ điều gì khác</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Button onClick={handleNext} style={{ width: '100%', color: '#fff', fontWeight: 'bold', backgroundColor: 'rgb(103,181,250)', height: '35px' }}>Tiep theo</Button>
                            <Button onClick={handleReturn} style={{ width: '100%', color: 'rgb(103,181,250)', fontWeight: 'bold', backgroundColor: '#fff', height: '35px' }}>Quay lại</Button>
                        </div>
                    </WrapperDiv2>
                    <div style={{ border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px', margin: '50px 0' }}>
                        <p> Bạn đã có tài khoản? </p>
                        <p onClick={() => navigate('/login')} style={{ color: 'rgb(0,149,246)', fontWeight: 'bold', cursor: 'pointer' }}> Đăng nhập</p>
                    </div>
                </WrapperDiv >
            </>
        )
    }

    return (
        <>
            {/* {registerSuccess ? renderFormBirthday() : renderFormRegister()} */}
            {renderForm()}
            {/* <WrapperDiv>
                <WrapperDiv2>
                    <h1>Instagram</h1>
                    <h4>Đăng ký để xem ảnh và video từ bạn bè.</h4>
                    <Button> Đăng nhập bằng facebook</Button>
                    <div>
                        <Divider>Hoặc</Divider>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                        <Input onChange={(e) => handleOnChangeEmail(e)} value={email} type='text' placeholder='Phone or email'></Input>
                        <Input onChange={(e) => handleOnChangeFullName(e)} value={fullName} type='text' placeholder='Full name'></Input>
                        <Input onChange={(e) => handleOnChangeUserName(e)} value={userName} type='text' placeholder='Name user'></Input>
                        <div style={{ position: 'relative' }}>
                            <Input onChange={(e) => handleOnChangePassword(e)} value={password} type={showPassword ? 'password' : 'text'} placeholder='Password'></Input>
                            <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', zIndex: '10', right: '0', paddingTop: '5px', paddingRight: '10px' }}>
                                {showPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgb(115,115,115)' }}>Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Instagram.</p>
                    </div>
                    <div>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgb(115,115,115)' }}>Bằng cách đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi.</p>
                    </div>


                    <Button onClick={handleRegister} style={{ width: '100%', color: '#fff', fontWeight: 'bold', backgroundColor: 'rgb(103,181,250)', height: '35px' }}>Đăng ký</Button>
                </WrapperDiv2>
                <div style={{ border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px', margin: '50px 0' }}>
                    <p> Bạn đã có tài khoản? </p>
                    <p onClick={() => navigate('/login')} style={{ color: 'rgb(0,149,246)', fontWeight: 'bold', cursor: 'pointer' }}> Đăng nhập</p>
                </div>
            </WrapperDiv > */}
        </>
    )
}
