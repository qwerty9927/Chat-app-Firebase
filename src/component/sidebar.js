import { getAdditionalUserInfo, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState, useRef, useContext, memo, useMemo, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import './sidebar.css'
import { auth } from './config';
import { getAllDocumentData, sendResquest, userInvited } from './connect_to_ser';
import Resquest from './Resquest';
import Invite from './Invite';
import Accept from './Accept';
import FriendList from './FriendList';

function SideBar(){
    const [state, setState] = useState([])
    const [valueInput, setValueInput] = useState("")
    const [mainUser, setMainUser] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        const unsubscrited = onAuthStateChanged(auth, (user) => {
            if(!user) {
                navigate("/login")
            }else {
                setMainUser(user)
            }
        })
        return () => {
            unsubscrited()
        }
    }, [])
    async function handleInput(value){
        let arr = []
        const data = await getAllDocumentData("users")
        data.map(user => {
            if(user.displayName.toLowerCase().startsWith(value.toLowerCase())){
                arr.push(user)
            }
        })
        setState(arr)
    }

    return (
        <div className="side-bar">
            <div className="private-box">
                <div className="content-box">
                    <div className="avatar">
                        <img src={mainUser.photoURL} alt="" />
                    </div>
                    <div className="display-name">
                        <span className="name">{mainUser.displayName}</span>
                    </div>
                </div>
                <div className="mail-box">
                    <i className="fas fa-envelope-open-text"></i>
                    <div className="pesudo-div">
                        <div className="container-mail">
                            {useMemo(() => <Resquest />,[])}
                            {useMemo(() => <Invite />,[])}
                            {useMemo(() => <Accept />,[])}
                        </div>
                    </div>
                </div>
            </div>
            <div className="search-box">
                <input 
                    type="text" 
                    placeholder="Search Friend ..."
                    value = {valueInput}
                    onChange={(e) => {
                        handleInput(e.target.value)
                        setValueInput(e.target.value)
                    }
                }/>
                <div className="drop-box">
                    <div className="header-item">
                        <div className="icon-search">
                            <i className="fas fa-search"></i>
                        </div>
                        <div className="word-search">
                            <span>Search messages for "{valueInput}"</span>
                        </div>
                    </div>
                    {state.map((user, index) => {
                        return (
                            <div className="item-drop-box" key={index}>
                                <div className="item-content">
                                    <div className="avatar">
                                        <img src={user.photoURL} alt="" />
                                    </div>
                                    <div className="display-name">
                                        <span className="name">{user.displayName}</span>
                                    </div>
                                </div>
                                <div className="item-btn" onClick = {() => {
                                    sendResquest(user.id)
                                    userInvited(user.id)
                                    }}>
                                    <i className="fas fa-user-plus"></i>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {useMemo(() => <FriendList />,[])}
        </div>
    )
}

export default SideBar