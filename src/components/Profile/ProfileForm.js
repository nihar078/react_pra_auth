import { useContext, useRef } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../../store/auth-contex';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory()

  const submitHandler = (event) =>{
    event.preventDefault();

    const enteredPassword = newPasswordInputRef.current.value;

    fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDIOtK9KjG2u6HShydzjkl7SCo47GPn-1Q", {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredPassword,
        returnSecureToken: false,
      }),
      headers : {
        "Content-Type": "application/json"
      }
    }).then((res) => {
      if(res.ok){
        alert("Your password is changed succesfully");
        history.replace("/")
      }
      else{
        return res.json().then((data) => {
          alert(data.error.message)
        })
      }
    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
