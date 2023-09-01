import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './Register'
import Login from './Login'

export default function Index() {
    return (
        <>
            <main className='auth'>
                <Routes>
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                    <Route path="*" element={<h1>404</h1>} />
                </Routes>
            </main>
        </>
    )
}
