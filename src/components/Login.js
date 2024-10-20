/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { login } from "../actions/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    if (username && password) {
      dispatch(login(username, password))
        .then(() => {
          navigate("/user");
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/profile" />;
  }

  return (
    <div className="col-md-12">
      <div className="loginform">
        <a href="/" id="arrowback" className="bi bi-arrow-left-short" />
        <h1 className="loginheader">
          Welcome to <span className="stylePostik">Postik</span>!
        </h1>
        <Form onSubmit={handleLogin} className="floform">
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
          <div className="buttondiv">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="loginbutton"
            >
              {loading && (
                <span>
                  <Spinner animation="border" />
                </span>
              )}
              <span>Login</span>
            </Button>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  <p>Wrong username or password.</p>
                </div>
              </div>
            )}
            <p className="registermessage">Don't have an account yet? <a href="/register">Register</a></p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
