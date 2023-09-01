import React, { useState } from 'react'
import { Button, Checkbox, Divider, Form, Input, Space, Tooltip, Typography, message, } from 'antd'
import { GoogleOutlined } from "@ant-design/icons"
import { useAuthContext } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, firestore } from '../../config/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { FaFacebookF } from 'react-icons/fa'


const { Title } = Typography

export default function Register() {
    const navigate = useNavigate()
    const { dispatch } = useAuthContext()
    const [state, setState] = useState({ fullName: "", email: "", password: "", confirmPasword: "" })
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleRegister = e => {


        let { fullName, email, password, confirmPasword } = state



        setIsProcessing(true)
        createUserWithEmailAndPassword(auth, email, password, confirmPasword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // console.log(user)
                addDocument(user)
                dispatch({ type: "Login", payload: { user } })
                console.log("user register")

            })
            .catch((error) => {
                console.error(error)
                // window.toastify("Email Not Valid", "error")
                message.error("Email Not Valid")
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
            // window.toastify("Registration Successfully", "success")
            message.success("Registeration Successfully")
            navigate("/")
        }
        catch (err) {
            // window.toastify("something went wrong while add data in firestore", "error")
            message.error("something went wrong while add data in firestore")
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
    //             const credential = FacebookAuthProvider.credentialFromResult(result);
    //             const accessToken = credential.accessToken;
    //             addDocument(user)

    //         })
    //         .catch((error) => {
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
                        <Title level={2} className='m-0 text-center mb-4'>Sign Up</Title>

                        <Form layout="vertical" autoComplete='off'

                            onFinish={handleRegister}

                        >
                            <Form.Item label="Full Name" name='fullName'
                                rules={[
                                    {
                                        required: true,
                                        message: "Please type your name."
                                    },
                                    { whitespace: true },
                                    { min: 3 }
                                ]}
                                hasFeedback
                            >
                                <Input placeholder='FullName' name='fullName' onChange={handleChange} />
                            </Form.Item>
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

                            <Form.Item name='agreement' valuePropName='checked'
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value
                                                ? Promise.resolve()
                                                : Promise.reject("To proceed, you need to agree with our terms and conditions.")
                                    }
                                ]}
                            >
                                <Checkbox>Agree to our <a href='#'>Terms and Conditions</a></Checkbox>
                            </Form.Item>

                            <Button type='primary' htmlType='submit' className='w-100 mb-4' loading={isProcessing}   >Submit</Button>

                            <div className="d-flex  justify-content-center text-center mb-2">

                                <Tooltip title='Google' className='d-flex align-items-center justify-content-center'><Button type='primary' icon={<GoogleOutlined />} onClick={handleGoogle} >Google</Button></Tooltip>

                            </div>
                            <p className='text-center'>Already a user? <Link to="/auth/login">Sign in</Link></p>
                            {/* <Divider /> */}
                        </Form>
                    </div>
                </div>
            </div>
        </div >

    )
}
