const firebaseConfig = {
  apiKey: "AIzaSyDQtBb8zDA1iPZBRjFtXjcnj2zAIhlHzIY",
  authDomain: "ysg-portal.firebaseapp.com",
  projectId: "ysg-portal",
  storageBucket: "ysg-portal.appspot.com",
  messagingSenderId: "91821075370",
  appId: "1:91821075370:web:80369759cd25604e7499d3",
  measurementId: "G-EC8037VVTR",
};

const app = firebase.initializeApp(firebaseConfig);
const LoginURL = "https://eyadwebdeveloper.github.io/YSJ-Portal/";
function CheckUserCredits() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      user
        .getIdTokenResult()
        .then((idTokenResult) => {
          if (!localStorage.getItem(idTokenResult.token)) {
            location.href = LoginURL;
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      location.href = LoginURL;
    }
  });
}
const signOut = async (_) => {
  await firebase.auth().signOut();
  localStorage.clear();
  CheckUserCredits();
};
CheckUserCredits();
