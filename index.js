
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
      user.getIdTokenResult().then((idTokenResult) => {
        localStorage.clear();
        localStorage.setItem(idTokenResult.token, idTokenResult.token);
        location.href = domain + '/index2.html'
      });
    })
    .catch((error) => {
      giveAlert(
        error.message ==
          '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}'
          ? "Wrong Email or Password"
          : error.message,
        "#e92929", "YSJ:"
      );
    });
});
