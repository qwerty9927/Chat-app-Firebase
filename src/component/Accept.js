import { collection, onSnapshot, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, db } from "./config"
import { getAllDocument, getAllDocumentData } from "./connect_to_ser"

function Accept(){

    const [state, setState] = useState([])
    useEffect(() => {
        async function fetchData(){
            let pathRef
            const docsRefFirst = await getAllDocument("users")
            docsRefFirst.forEach(doc => {
                if(doc.data().id === auth.currentUser.uid){
                    pathRef = doc.ref.path + "/accepted"
                }
            })
            const q = query(collection(db, pathRef))
            const unsub = onSnapshot(q, async (querySnapshot) => {
                let listUser = []
                const docsRefSecond = await getAllDocumentData("users")
                querySnapshot.docs.map( resquest => {
                    docsRefSecond.map(user => {
                        if(resquest.data().id === user.id){
                            listUser.push(user)
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

    return (
        <div className="accept">
            <label>Accepted</label>
            {state.map((item, index) => {
                return (
                    <div className="main-item-of-mail-box item" key={index}>
                        <div className="avatar">
                            <img src={"avatar.png" || item.photoURL}  alt="" />
                        </div>
                        <div className="content-accept">
                            <div className="displayName">
                                <span>{item.displayName}</span>
                            </div>
                            <div className="message-accept">
                                
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default Accept