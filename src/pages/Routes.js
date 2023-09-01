import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import Frontend from './Frontend'
import Auth from '../pages/Auth'
import PrivateRoute from '../components/PrivateRoute'
export default function Index() {
    const { isAuth } = useAuthContext()
    return (
        <>
            <Routes>
                <Route path='/*' element={<PrivateRoute Component={Frontend} />} />
                <Route path='/auth/*' element={!isAuth ? <Auth /> : <Navigate to="/" />} />
            </Routes>

        </>
    )
}
