import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-contex";

const AuthForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    // if (isLogin) {
    //   fetch(
    //     "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDIOtK9KjG2u6HShydzjkl7SCo47GPn-1Q",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         email: enteredEmail,
    //         password: enteredPassword,
    //         returnSecureToken: true,
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   ).then((res) => {
    //     setIsLoading(false);
    //     if (res.ok) {
    //       return res.json().then((data) => {
    //         console.log(data);
    //         console.log("Token ID: ", data.idToken);
    //         authCtx.login(data.idToken);
    //       });
    //     } else {
    //       return res.json().then((data) => {
    //         let errorMessage = "Authentication failed!";
    //         if (data && data.error && data.error.message) {
    //           errorMessage = data.error.message;
    //         }
    //         alert(errorMessage);
    //       });
    //     }
    //   });
    // } else {
    //   fetch(
    //     "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDIOtK9KjG2u6HShydzjkl7SCo47GPn-1Q",
    //     {
    //       method: "POST",
    //       body: JSON.stringify({
    //         email: enteredEmail,
    //         password: enteredPassword,
    //         returnSecureToken: true,
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   ).then((res) => {
    //     setIsLoading(false);
    //     if (res.ok) {
    //     } else {
    //       res.json().then((data) => {
    //         let errorMessage = "Authentication failed!";
    //         if (data && data.error && data.error.message) {
    //           errorMessage = data.error.message;
    //         }
    //         alert(errorMessage);
    //       });
    //     }
    //   });
    // }

    //or

    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDIOtK9KjG2u6HShydzjkl7SCo47GPn-1Q";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDIOtK9KjG2u6HShydzjkl7SCo47GPn-1Q";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
              throw new Error(errorMessage);
            }
            // alert(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data);
        // console.log("Token ID is: ", data.idToken);
        authCtx.login(data.idToken);
        history.replace("/");
        setInterval(authCtx.logout, 300000)
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create an account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
