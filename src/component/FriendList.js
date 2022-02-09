import { collection, onSnapshot, query } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import Context from "../global/context"
import { auth, db } from "./config"
import { getAllDocument, getAllDocumentData } from "./connect_to_ser"

function FriendList(){
    const [state, setState] = useState([])
    const [globalState, setGlobalState] = useContext(Context)

    useEffect(() => {
        async function fetchData(){
            let pathRef
            const docsRefFirst = await getAllDocument("users")
            docsRefFirst.forEach(doc => {
                if(doc.data().id === auth.currentUser.uid){
                    pathRef = doc.ref.path + "/friendList"
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

    function handleClickFriend(ele, idClick){
        document.querySelectorAll('.item').forEach(item => {
            item.classList.remove('active')
        })
        ele.classList.add('active')
        setGlobalState(idClick)
        console.log(idClick)
    }
    return (
        <div className="friends-list">
            {state.map((user, index) => {
                return (
                    <div className="item" key={index} onClick={(e) => {
                        handleClickFriend(e.target.closest(".item"), user.id)
                    }}>
                        <div className="avatar">
                            <img src={user.photoURL} alt="" />
                        </div>
                        <div className="display-name">
                            <span className="name">{user.displayName}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default FriendList