import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdditionalUserInfo, onAuthStateChanged } from 'firebase/auth'
import './main.css'
import { handleLogOut } from './inOut'
import { auth } from './config'
import { getAllDocument, getAllDocumentData, pushMess } from './connect_to_ser'
import Context from '../global/context'
import Room from './Room'

function Main(){
    const navigate = useNavigate()
    const [globalState, setGlobalState] = useContext(Context)
    const [mess, setMess] = useState("")
    useEffect( () => {
        const unsubscrited = onAuthStateChanged(auth, (user) => {
            if(!user){
                navigate("/login")
            }
        })
        return () => {
            unsubscrited()
        }
    }, [])

    useMemo(() => {
        async function fetchData(){
            const docsRef = await getAllDocumentData("users")
            docsRef.map(user => {
                if(user.id == globalState){
                    setGlobalState(user)
                }
            })
        }
        fetchData()
    },[globalState])

    function handleInput(value){
        setMess((prev) => {
            console.log(prev)
            return value
        })
    }
    return (
        <div className="main">
            <div className="header">
                <div className="status">
                    <div className="avatar">
                        <img src={globalState.photoURL} alt="" />
                    </div>
                    <div className="display-name">
                        <span className="name">{globalState.displayName}</span>
                    </div>
                </div>
                <div className="log-out" onClick={handleLogOut}>
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </div>
            <Room />
            <div className="chat-box">
                <input 
                    type="text" 
                    placeholder='Message'
                    value={mess}
                    onChange={(e) => {
                        handleInput(e.target.value)
                    }}
                />
                <div className="btn-bg">
                    <button onClick={() => {
                        pushMess(mess, globalState.id)
                        setMess("")
                    }}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Main