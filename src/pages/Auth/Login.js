import React, { useState } from 'react'
import { Button, Divider, Form, Input, Space, Tooltip, Typography, message } from 'antd'
import { GoogleOutlined } from "@ant-design/icons"
import { useAuthContext } from "../../contexts/AuthContext"
import { Link, useNavigate } from 'react-router-dom'
import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

import { FaFacebookF } from "react-icons/fa";
import { auth, firestore } from '../../config/firebase'
import { doc, setDoc } from 'firebase/firestore'


const { Title } = Typography

export default function Login() {
    const navigate = useNavigate()
    const { dispatch } = useAuthContext()
    const [state, setState] = useState({ email: "", password: "", confirmPassword: "" })
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleLogin = e => {
        let { email, password, confirmPassword } = state

        setIsProcessing(true)
        signInWithEmailAndPassword(auth, email, password, confirmPassword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                addDocument(user)
                dispatch({ type: "Login", payload: { user } })
                // console.log("user Login")

            })
            .catch((error) => {
                // window.toastify("Something went wrong while Login Account.", "error")
                message.error("something went wrong while add user in firestore.")
                setIsProcessing(false)

            });
    }

    const addDocument = async (user) => {

        try {
            await setDoc(doc(firestore, "users", user.uid), {
                fullName: "",
                uid: user.uid
            });
            setIsProcessing(false)
            // window.toastify("User Logged in Successfully.", "success")
            message.success("User Logged in Successfully.")
            navigate("/")
        }
        catch (err) {
            // window.toastify("something went wrong while add user in firestore.", "error")
            message.error("something went wrong while add user in firestore.")

        }

    }

    const handleGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                addDocument(user)
                console.log(user)
            }).catch((error) => {
                // window.toastify("something went wrong while SignIn with Google", "error")
                message.error("something went wrong while SignIn with Google")
            });
    }

    // const handleFacebook = () => {
    //     const provider = new FacebookAuthProvider();
    //     signInWithPopup(auth, provider)
    //         .then((result) => {
    //             // The signed-in user info.
    //             const user = result.user;
    //             // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    //             // const credential = FacebookAuthProvider.credentialFromResult(result);
    //             // const accessToken = credential.accessToken;
    //             addDocument(user)

    //         }).catch((error) => {
    //             // window.toastify("something went wrong while SignIn with Facebook", "error")
    //             message.error("something went wrong while SignIn with Facebook")

    //             console.error(error)
    //         });
    // }



    return (

        <div className="container" id='authContainer'>
            <div className="row">
                <div className="col">
                    <div className="card p-3 p-md-4">
                        <Title level={2} className='m-0 text-center mb-4'>Sign In</Title>

                        <Form layout="vertical"
                            onFinish={handleLogin}
                        >

                            <Form.Item label="Email" name='email'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please type your email correctly.'
                                    },
                                    { type: 'email', message: 'Please enter a valid email.' }

                                ]}
                                hasFeedback
                            >
                                <Input placeholder='Email' name='email' onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label="Password" name='password'
                                rules={[
                                    {
                                        required: true,
                                    },
                                    { min: 6 }
                                ]}
                                hasFeedback
                            >
                                <Input.Password placeholder='Password' name='password' onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Confirm Password" name='confirmpassword'
                                dependencies={['password']}
                                rules={[
                                    {
                                        required: true,
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject("Passwod does not match with confirm Password.")
                                        }
                                    })
                                ]}
                                hasFeedback
                            >
                                <Input.Password placeholder='Confirm Password' name='confirmpassword' onChange={handleChange} />
                            </Form.Item>

                            <Button type='primary' htmlType='submit' className='w-100 mb-4 mt-3' loading={isProcessing} >Sign in</Button>
                            {/* <div className='mt-3 text-end'><Link to="/auth/forget-password">Forget Password?</Link></div> */}
                            {/* <Divider plain>or Login with social</Divider> */}
                            <div className="d-flex  justify-content-center text-center mb-2">

                                <Tooltip title='Google' className='d-flex align-items-center justify-content-center'><Button type='primary' icon={<GoogleOutlined />} onClick={handleGoogle} >Google</Button></Tooltip>

                            </div>
                            <p className='text-center mt-2'> Don't have an account? <Link to="/auth/register">Sign up</Link></p>
                        </Form>
                    </div>
                </div>
            </div >
        </div >

    )
}
