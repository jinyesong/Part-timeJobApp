const db = firebase.firestore(); 
    db.collection('customer').get().then((snapshot)=>{ //collection의 모든 object가져오기
        snapshot.forEach((doc)=>{
            console.log(doc.data())
        })
    })

