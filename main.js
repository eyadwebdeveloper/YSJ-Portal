const firebaseConfig = {
  apiKey: "AIzaSyDQtBb8zDA1iPZBRjFtXjcnj2zAIhlHzIY",
  authDomain: "ysg-portal.firebaseapp.com",
  projectId: "ysg-portal",
  storageBucket: "ysg-portal.appspot.com",
  messagingSenderId: "91821075370",
  appId: "1:91821075370:web:80369759cd25604e7499d3",
  measurementId: "G-EC8037VVTR"
};
const app = firebase.initializeApp(firebaseConfig);
function CheckUserCredits() {
  firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      user
        .getIdTokenResult()
        .then(async (idTokenResult) => {
          if (!localStorage.getItem(idTokenResult.token)) {
            location.href = domain;
          } else {
            const userRef = firebase
              .firestore()
              .collection("users")
              .doc(user.email);
            const userData = await userRef.get();
            const data = await userData.data();
            if (data?.submitted) {
              location.href = domain + "/status.html";
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
const signOut = async (_) => {
  await firebase.auth().signOut();
  localStorage.clear();
  CheckUserCredits();
};
CheckUserCredits();