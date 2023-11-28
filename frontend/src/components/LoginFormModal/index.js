// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(data)
        if (data) {
          setErrors({"message":"The provided credentials were invalid"});
          console.log(errors)
        }
      });
  };

  const handleLogin = (e) =>{
    closeModal()
  }
  const handleDemo = (e) =>{
    e.preventDefault()
    setErrors({});
   dispatch(sessionActions.login({ credential:"Demo-lition", password:"password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
      });
  }

  return (
    <>
    <div className="loginBox">
      <div className="loginTitle">
      <h1>Log In</h1>
      </div>
      <form onSubmit={handleSubmit}>
      {(errors)&&(
          <p className="errors">
        {errors.message}
      </p>)}
      <div className="usernameInput">
        <label>
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        </div>
        <div className="passwordInput">
          <label>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        </div>
        {errors.credential && (
          <p className="errors">
          {errors.credential}</p>
        )}
        <div className="loginButton">
        <button type="submit"
        // onClick={handleLogin}
        disabled={credential.length<4&&password.length<6}
        >Log In</button>
        </div>
        <div className="demo">
          <button
          onClick={handleDemo}
          >Demo User</button>
        </div>
      </form>
      </div>
    </>
  );
}

export default LoginFormModal;
