// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, query, collection, addDoc, deleteDoc, doc, onSnapshot, } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEfUnwa4ZXVYr5wEnbHJQAlMz6H9PM7qk",
    authDomain: "quregweb.firebaseapp.com",
    projectId: "quregweb",
    storageBucket: "quregweb.appspot.com",
    messagingSenderId: "89979763509",
    appId: "1:89979763509:web:069245be7c8cb852072a7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();


const cardid = document.getElementById('inputCardID');
const firstname = document.getElementById('inputName');
const surname = document.getElementById('inputSurname');
const tableUsers = document.querySelector('.table');
const addBtn = document.getElementById('regBtn');

const renderUser = docs => {
    const tr = `
         <tr data-id = '${docs.id}'>
             <td>${docs.data().cardid}</td>
             <td>${docs.data().firstname}</td>
             <td>${docs.data().surname}</td>
             <td>
                 <button class="btn btn-delete">Delete</button>
             </td>
         </tr>`;
    tableUsers.insertAdjacentHTML('beforeend', tr);

    const btnDelete = document.querySelector(`[data-id = '${docs.id}'] .btn-delete`);
    btnDelete.addEventListener('click', async () => {
        await deleteDoc(doc(db, "users", `${docs.id}`));
        console.log("Doc deleted")
    });
}

//const querySnapshot = await getDocs(collection(db, "users"));
// querySnapshot.forEach((docs) => {
//     renderUser(docs);
//     console.log(docs.data());
// });

const q = query(collection(db, "users"));
const realtimeSnap = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added') {
            renderUser(change.doc);
        }

        if(change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            tableUsers.removeChild(tbody);
        }
    });
});

addBtn.addEventListener('click', async e => {
    e.preventDefault();
    try {
        const docRef = await addDoc(collection(db, "users"), {
            cardid: cardid.value,
            firstname: firstname.value,
            surname: surname.value
        });
        console.log("Document written with ID: ", docRef.id)
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});
