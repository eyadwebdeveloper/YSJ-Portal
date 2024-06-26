const firebaseConfig = {
  apiKey: "AIzaSyBUvo1R8ubtWG2p4dCCf4Gy-iwnfOCOyX0",
  authDomain: "ysj-juniors.firebaseapp.com",
  projectId: "ysj-juniors",
  storageBucket: "ysj-juniors.appspot.com",
  messagingSenderId: "529403106761",
  appId: "1:529403106761:web:359111c36f1e7d00348418",
  measurementId: "G-TLJT4228V1"
};

const app = firebase.initializeApp(firebaseConfig);
const signOut = async (_) => {
  await firebase.auth().signOut();
  localStorage.clear();
  CheckUserCredits();
};
function CheckUserCredits() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      user
        .getIdTokenResult()
        .then(async (idTokenResult) => {
          if (!localStorage.getItem(idTokenResult.token)) {
            location.href = domain;
          } else {
            const userRef = firebase
              .firestore()
              .collection("juniors")
              .doc(user.email);
            const userData = await userRef.get();
            const data = await userData.data();
            if (data?.submitted) {
              document.querySelector("h1 span#name").innerText = data["Full Name"];
            } else {
              location.href = domain + "/questions.html";
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      location.href = domain;
    }
  });
}
CheckUserCredits();
