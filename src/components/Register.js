/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { register } from "../actions/auth";

import "./Register.css";

const Register = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);
    setLoading(true);

    if (true) {
      dispatch(register(username, password))
        .then(() => {
          setSuccessful(true);
          setLoading(false);
        })
        .catch(() => {
          setSuccessful(false);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    let timeout;
    if (successful) {
      timeout = setTimeout(() => {
        setRedirectToLogin(true);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [successful]);

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="col-md-12">
      <div className="loginform">
        <a href="/" id="arrowback" className="bi bi-arrow-left-short" />
        <h1 className="loginheader">
          Create your first account in{" "}
          <span className="stylePostik">Postik</span>!
        </h1>
        <Form onSubmit={handleRegister} className="floform">
          <FloatingLabel controlId="floatingInput" label="Username">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="placeholder-color"
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="placeholder-color"
            />
          </FloatingLabel>
          <Form.Check // prettier-ignore
            type="checkbox"
            id="checkbox"
            label="Accept terms and conditions to register in Postik."
            className="checkbox-terms"
          />
          <div className="buttondiv">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="registerbutton"
            >
              {loading && (
                <span>
                  <Spinner animation="border" />
                </span>
              )}
              <span>Register</span>
            </Button>
            {message && (
              <div className="form-group">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
            <p className="registermessage">
              Do you have an account already? <a href="/login">Login</a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
