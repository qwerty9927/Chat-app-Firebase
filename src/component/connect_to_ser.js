import { getAdditionalUserInfo } from "firebase/auth"
import { addDoc, collection, doc, getDocs, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./config"

async function pushUser(userCredential, data){
    if(getAdditionalUserInfo(userCredential).isNewUser){
        try{
            const docRef = await addDoc(collection(db, "users"), {
                id: data.uid,
                displayName: data.displayName,
                photoURL: data.photoURL,
                email: data.email
            }) 
            console.log(docRef)
        }catch(e){
            console.log(e)
        }
    }
}
async function getAllDocument( ArgCollection ){
    const allDocment = await getDocs(collection(db, ArgCollection))
    return allDocment.docs
}
async function getAllDocumentData( ArgCollection ){
    const allDocment = await getDocs(collection(db, ArgCollection))
    return allDocment.docs.map(user => user.data())
}

async function sendResquest(idOnClick){
    //push idOnClick to data of current user
    const allDocument = await getAllDocument("users")
    allDocument.map( ref => {
        if(ref.data().id === idOnClick){
            const col = addDoc(collection(db, "users", `${ref.id}`, "resquested"),{
                id: auth.currentUser.uid,
                timestamp: serverTimestamp(),
                state: false
            })
        }
    })
}

async function userInvited(idOnClick){
    const allDocument = await getAllDocument("users")
    allDocument.map( ref => {
        if(ref.data().id === auth.currentUser.uid){
             addDoc(collection(db, "users", `${ref.id}`, "invited"),{
                id: idOnClick,
                timestamp: serverTimestamp(),
                state: false
            })
        }
    })
}

async function pushMess(value, argId){
    const docsRef = await getAllDocument("rooms")
    docsRef.map( async item => {
        let idNeed
        item.data().idUsers.map( (id, index) => {
            if(id == auth.currentUser.uid){
                const arr = [...item.data().idUsers]
                arr.splice(index, 1)
                idNeed = arr
            }
        })
        if(idNeed[0] === argId){
           await addDoc(collection(db, "rooms" + "/" + item.id + "/" + "messages"), {
                id: auth.currentUser.uid,
                mess: value,
                timestamp: serverTimestamp()
           })
        }
    })
}


export { pushUser, getAllDocument, getAllDocumentData, sendResquest, userInvited, pushMess }