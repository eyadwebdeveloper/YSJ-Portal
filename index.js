const button = document.querySelector(".btnss a");
button.addEventListener("click", (e) => {
  e.preventDefault();
  firebase
    .auth()
    .signInWithEmailAndPassword(
      document.getElementById("email").value,
      document.getElementById("password").value
    )
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      user.getIdTokenResult().then((idTokenResult) => {
        localStorage.clear();
        localStorage.setItem(idTokenResult.token, idTokenResult.token);
        (async () => {
          const userRef = firebase
            .firestore()
            .collection("juniors")
            .doc(user.email);
          const userData = await userRef.get();
          const data = await userData.data();
          if (data?.submitted) {
            location.href = domain + "/status.html";
          } else {
            location.href = domain + "/Welcome.html";
          }
        })();
      });
    })
    .catch((error) => {
      giveAlert(
        error.message ==
          '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}'
          ? "Wrong Email or Password"
          : error.message,
        "#e92929",
        "YSJ:"
      );
    });
});
