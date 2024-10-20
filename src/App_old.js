import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import HomePage from "./components/HomePage";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import AuthVerify from "./common/AuthVerify";
import ForEveryone from "./components/ForEveryone";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let location = useLocation();

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage()); 
    }
  }, [dispatch, location]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          </div>
        <Link to={"/"} className="navbar-brand">
          Postik
        </Link>

        <div className="navbar-nav mr-auto">

          {currentUser && (
            <li className="nav-item">
              <Link to={"/for-everyone"} className="nav-link">
                For everyone
              </Link>
            </li>
          )}
        </div>

        <div className="navbar-nav mr-auto">

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <button onClick={logOut} className="nav-link">
                LogOut
              </button>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<Profile />} />
          <Route path="/for-everyone" element={<ForEveryone />} />
        </Routes>
      </div>

      <AuthVerify logOut={logOut}/>
    </div>
  );
};

export default App;