import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'

const AuthContext = createContext()
const initialState = { isAuth: false, user: {} }

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "Login":
            return { isAuth: true, user: payload.user }
        case "Logout":
            return initialState
        default:
            return state
    }
}

export default function AuthContextProvider({ children }) {

    const [isAppLoading, setIsAppLoading] = useState(true)
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                // const uid = user.uid;
                dispatch({ type: "Login", payload: { user } })
                setIsAppLoading(false)
                // ...
            } else {
                // User is signed out
                // ...
                setIsAppLoading(false)
            }
        });

    }, [])

    return (

        <AuthContext.Provider value={{ isAppLoading, ...state, dispatch }}>
            {children}
        </AuthContext.Provider>

    )
}



export const useAuthContext = () => useContext(AuthContext)