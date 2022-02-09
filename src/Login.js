import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'

import './Login.css'
import { handleLogin } from './component/inOut'
import { auth } from './component/config'
import Context from './global/context';

function Login(){
    const [globalState, setGlobalState] = useContext(Context)
    const navigate = useNavigate()
    useEffect(() => {
        const unsubscrited = onAuthStateChanged(auth, (user) => {
            if(user) {
                navigate("/")
            }
        })
        return () => {
            unsubscrited()
        }
    }, [])
    return (
        <div className="login">
            <h1>Login</h1>
            <button 
                className="google-btn"
                onClick={handleLogin}
            >
                    <i className="fab fa-google"></i>
                    <span>Sign in with Google</span>
            </button>
        </div>
    )
}

export default Login;