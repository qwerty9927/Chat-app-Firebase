import { addDoc, collection, deleteDoc, doc, FieldPath, getDocs, onSnapshot, query, QuerySnapshot, serverTimestamp } from "firebase/firestore"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { auth, db } from "./config"
import { getAllDocument, getAllDocumentData } from "./connect_to_ser"

function Resquest(){
    const pathRef = useRef([])
    const [state, setState] = useState([])

    useEffect(() => {
        async function fetchData(){
            const docsRefFirst = await getAllDocument("users")
            docsRefFirst.forEach(doc => {
                if(doc.data().id === auth.currentUser.uid){
                    pathRef.current = doc.ref.path
                }
            })
            const q = query(collection(db, pathRef.current + "/resquested"))
            const unsub = onSnapshot(q, async (querySnapshot) => {
                let listUser = []
                const docsRefSecond = await getAllDocument("users")
                querySnapshot.docs.forEach( resquest => {
                    docsRefSecond.map(user => {
                        if(resquest.data().id === user.data().id){
                            listUser.push({user, timestamp: resquest.data().timestamp})
                        }
                    })
                   
                })
                setState([...listUser])
            })
            return () => {
                unsub()
            }
        }

        fetchData()
    },[])
    async function deleteInviteOfUserRes(arg){
        const pathInvite = "users" + "/" + arg + "/" + "invited";
        const docsRefInvite = await getAllDocument(pathInvite)
        docsRefInvite.map(item => {
            if(item.data().id === auth.currentUser.uid){
                deleteDoc(doc(db, pathInvite + "/" + item.id))
            }
        })
    }
    function deleteData(arg){
        state.forEach(async (item, index) => {
            if(arg === index){
                const docsRefRequest = await getAllDocument(pathRef.current + "/resquested")
                docsRefRequest.map( subItem => {
                    if(subItem.data().id === item.user.data().id){
                        deleteDoc(doc(db, pathRef.current + "/resquested" + "/" + subItem.id))
                        deleteInviteOfUserRes(item.user.id)
                    }
                })
            }
        })
    }
    function addFriends(arg){
        state.forEach(async (item, index) => {
            if(arg === index){
                await addDoc(collection(db, pathRef.current + "/friendList"), {
                    id: item.user.data().id
                })
                await addDoc(collection(db, "users" + "/" + item.user.id + "/friendList"), {
                    id: auth.currentUser.uid
                })
                await addDoc(collection(db, "rooms"), {
                    idUsers: [auth.currentUser.uid, item.user.data().id]
                })
                await addDoc(collection(db, "users" + "/" + item.user.id + "/accepted"), {
                    id: auth.currentUser.uid
                })
            }
        })
    }
    function handleRefuse(index, ele){
        ele.style.display = "none"
        deleteData(index)
    }
    function handleConfirm(index, ele){
        ele.style.display = "none"
        addFriends(index)
        deleteData(index)
    }

    return (
        <div className="resquest">
            <label>Resquest</label>
            {state.map( (item, index) => {
                return (
                    <div className="main-item-of-mail-box item" key={index}>
                        <div className="left-mail-item">
                            <div className="avatar">
                                <img src={item.user.data().photoURL} alt="" />
                            </div>
                            <div className="content-resquest">
                                <div className="displayName">
                                    <span>{item.user.data().displayName}</span>
                                </div>
                                <div className="message-resquest">
                                    <span>{item.timestamp.toDate().toLocaleDateString()}</span>
                                </div>
                            </div>  
                        </div>
                        <div className="right-mail-item">
                            <div className="btn-of-resquest">
                                <button className="refuse" onClick={(e) => {
                                    handleRefuse(index, e.target.closest(".main-item-of-mail-box"))
                                }}>
                                    <i className="fas fa-users-slash"></i>
                                </button>
                                <button className="confirm" onClick={(e) => {
                                    handleConfirm(index, e.target.closest(".main-item-of-mail-box"))
                                }}>
                                    <i className="fas fa-user-friends"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}
export default Resquest