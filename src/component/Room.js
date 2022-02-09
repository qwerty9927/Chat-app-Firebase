import { addDoc, collection, onSnapshot, orderBy, query, get, startAfter, startAt } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import Context from "../global/context"
import { auth, db } from "./config"
import { getAllDocument, getAllDocumentData } from "./connect_to_ser"

function Room(){
    const [globalState, setGlobalState] = useContext(Context)
    const [state, setState] = useState([])
    useEffect(() => {
        async function fetchData(){
            const docsRef = await getAllDocument("rooms")
            let listMess
            docsRef.map( async item => {
                let idNeed
                item.data().idUsers.map( (id, index) => {
                    if(id == auth.currentUser.uid){
                        const arr = [...item.data().idUsers]
                        arr.splice(index, 1)
                        idNeed = arr
                    }
                })
                if(idNeed[0] === globalState){
                    const path = "rooms" + "/" + item.id + "/" + "messages"
                    const q = query(collection(db, path))
                    const unsub = onSnapshot(q, (querySnapshot) => {
                        console.log(querySnapshot)
                        listMess = []
                        querySnapshot.docs.map(mess => {
                            if(mess.data().timestamp){
                                listMess.push(mess.data())
                                let j
                                for(let i = 0; i < listMess.length - 1;i++){
                                    for(j = i + 1; j < listMess.length;j++){
                                        if(listMess[i].timestamp.toDate().getTime() > listMess[j].timestamp.toDate().getTime()){
                                            let temp = listMess[i]
                                            listMess[i] = listMess[j]
                                            listMess[j] = temp
                                        }
                                    }
                                }
                            }
                        })
                        setState([...listMess])
                    })
                    return () => {
                        unsub()
                    }
                }
            })
        }
        fetchData()
    },[globalState])
    return (
        <div className="box-message">
            {state.map((mess, index) => {
                if(mess.id === auth.currentUser.uid){
                    return  (
                        <div className="item-meg right-mess" key={index}>
                            <div className="block-mess">
                                <div className="message">
                                    <span className="clause">{mess.mess}</span>
                                    <span className="time">{mess.timestamp.toDate().toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <div className="avatar">
                                <img src={auth.currentUser.photoURL} alt="" />
                            </div>
                        </div>
                    )
                }else {
                    return (
                        <div className="item-meg" key={index}>
                            <div className="avatar">
                                <img src={globalState.photoURL} alt="" />
                            </div>
                            <div className="block-mess">
                                <div className="message">
                                    <span className="clause">{mess.mess}</span>
                                    <span className="time">{mess.timestamp.toDate().toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default Room