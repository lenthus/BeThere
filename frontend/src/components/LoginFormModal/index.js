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
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
      {(errors)&&(
          <p className="errors">
        {errors.message}
      </p>)}
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit"
        // onClick={handleLogin}
        disabled={credential.length<4&&password.length<6}
        >Log In</button>
        <div className="demo">
          <button
          onClick={handleDemo}
          >Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
