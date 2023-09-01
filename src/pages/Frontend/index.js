import React, { useState } from 'react';

// Pages
import Home from "./Home"
import Today from "./Today"
import Upcoming from "./Upcoming"
import Personal from './Personal';
import Work from './Work';
import Calendar from './Calendar/';

import { BiCalendar } from 'react-icons/bi';
import { MdOutlineStickyNote2 } from 'react-icons/md';
import { FaSignOutAlt } from 'react-icons/fa';
import { DoubleRightOutlined, UnorderedListOutlined, PlusOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Badge, Button, Col, ColorPicker, Form, Input, Layout, Menu, Modal, Row, message } from 'antd';
import { Link, Route, Routes } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';


const { Header, Content, Sider } = Layout;

const initialValue = {
    title: "",
    date: "",
    list: "",
    description: "",
}

const Sidebar = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [state, setState] = useState(initialValue)
    const [listModal, setListModal] = useState(false)
    const { dispatch } = useAuthContext()


    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))


    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                dispatch({ type: "Logout" })

            })
            .catch(() => {
                message.error("something wrong while logout user")
            })
    }
    const addList = () => {
        alert("New List Add")
        setListModal(false)
    }
    return (
        <>
            <main style={{ width: "100%" }}>

                <div className="container">
                    <div className="row">
                        <div className="col p-0">
                            <Layout style={{ height: "90vh", borderRadius: "15px", backgroundColor: "#fafafa" }} >
                                <Sider

                                    id='sider-scroll'
                                    style={{
                                        maxHeight: "85vh",
                                        borderRadius: "10px",
                                        margin: "20px 10px 10px 10px",
                                        background: "#f5f5f5",
                                        overflowY: "scroll",

                                    }}
                                    trigger={null} collapsible collapsed={collapsed}
                                    breakpoint="lg"
                                    collapsedWidth="80"
                                >


                                    <div className='sider-top'>
                                        <h4 style={{ display: !collapsed ? "block" : "none" }} className='menu'>Menu</h4>
                                        <div style={{ marginLeft: !collapsed ? "60px" : "12px" }} className="sider-bars">
                                            <Button
                                                type="text"
                                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                                onClick={() => setCollapsed(!collapsed)}
                                                style={{
                                                    fontSize: '12px',
                                                    background: "transparent"
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="demo-logo-vertical" />
                                    <Menu
                                        style={{

                                            background: "#f5f5f5"
                                        }}

                                        mode="inline"
                                        defaultSelectedKeys={['/']}
                                        items={[
                                            {
                                                style: { paddingLeft: "5px" },
                                                label: <span className='fs-8 mb-0'>TASKS</span>
                                            },

                                            {
                                                key: '/upcoming',
                                                icon: <DoubleRightOutlined />,
                                                label: <Link to='/upcoming' className='text-decoration-none'>Upcoming</Link>
                                            },
                                            {
                                                key: '/today',
                                                icon: <UnorderedListOutlined />,
                                                label: <Link to='/today' className='text-decoration-none'>Today</Link>
                                            },

                                            {
                                                key: '/calendar',
                                                icon: <BiCalendar />,
                                                label: <Link to='/calendar' className='text-decoration-none'>Calendar</Link>
                                            },
                                            {
                                                key: '/',
                                                icon: <MdOutlineStickyNote2 />,
                                                label: <Link to='/' className='text-decoration-none'>Sticky Wall</Link>
                                            },
                                            {
                                                style: { paddingLeft: "5px" },
                                                label: <span className='fs-8 mb-0'>LISTS</span>
                                            },
                                            {
                                                key: '/personal',
                                                icon: <Badge color='red' />,
                                                label: <Link to='/personal' className='text-decoration-none'>Personal</Link>
                                            },
                                            {
                                                key: '/work',
                                                icon: <Badge color='blue' />,
                                                label: <Link to='/work' className='text-decoration-none'>Work</Link>
                                            },

                                            {
                                                style: { marginLeft: "0" },
                                                key: 'addList',
                                                icon: <PlusOutlined />,
                                                label: <span onClick={() => setListModal(true)}>Add New List</span>
                                            },

                                            {
                                                // style: { marginTop: "60px" },
                                                key: 'login',
                                                icon: <FaSignOutAlt />,
                                                label: <Link to="/auth/login" style={{ textDecoration: "none" }} onClick={handleLogout} >Sign out</Link>

                                            },
                                        ]}
                                    />


                                </Sider>

                                <Layout style={{ borderRadius: "15px", backgroundColor: "#fafafa" }} >
                                    <Header
                                        style={{
                                            marginTop: "20px",
                                            padding: "0 0 0 15px",
                                            display: "flex",
                                            alignItems: "center",
                                            // background: colorBgContainer,
                                            backgroundColor: "#fafafa"
                                        }}
                                    >

                                        <h1 className='fw-bold'>Sticky Wall</h1>

                                    </Header>
                                    <Content
                                        id='ContentTodos'
                                        style={{

                                            margin: "12px",
                                            padding: 8,
                                            minHeight: 360,
                                            border: "1px solid   #f5f5f5",
                                            borderRadius: "5px",
                                            backgroundColor: "#fafafa",
                                            overflowY: "scroll"


                                        }}
                                    >

                                        <Routes>

                                            <Route path='/' element={<Home />} />
                                            <Route path='/today' element={<Today />} />
                                            <Route path='/upcoming' element={<Upcoming />} />
                                            <Route path='/personal' element={<Personal />} />
                                            <Route path='/work' element={<Work />} />
                                            <Route path='/calendar' element={<Calendar />} />


                                        </Routes>

                                    </Content>

                                </Layout>
                            </Layout>
                        </div>
                    </div>
                </div>
            </main >

            <Modal
                title="Add new List"
                centered
                open={listModal}
                onCancel={() => setListModal(false)}

                footer={[

                    <Button key="submit" type="primary" onClick={addList}>
                        Add List
                    </Button>,

                ]}
            >
                <Form layout="vertical" className='py-4'>
                    <Row gutter={16}>
                        <Col xs={24} lg={24}>
                            <Form.Item label="Enter the list name">
                                <Input placeholder='List Name' name='EnterTheListName' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={24}>
                            <Form.Item label="Color">
                                <ColorPicker name='color' />
                            </Form.Item>

                        </Col>

                    </Row>
                </Form>
            </Modal >
        </>
    );
};
export default Sidebar;