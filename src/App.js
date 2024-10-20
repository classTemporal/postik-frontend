import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import {
  Navbar,
  Button,
  Nav,
  Offcanvas,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import HomePage from "./components/HomePage";
import ForEveryone from "./components/ForEveryone";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import AuthVerify from "./common/AuthVerify";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [show, setShow] = useState(false);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Mostrar el Navbar solo si no estás en la ruta de login
  const showNavbar = location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <div className="base">
      {showNavbar && (
        <Navbar.Brand className="postiklogo">
          <a href="/">Postik</a>
        </Navbar.Brand>
      )}
      {showNavbar && (
        <div className="divnav">
          <Navbar className="navbar_">
            <Nav className="navbarlinks">
              {currentUser ? (
                <>
                  <NavLink to="/for-everyone" className="chatcontainer">
                    <i className="bi bi-chat-text"></i>
                  </NavLink>
                  <p className="postiklogoresponsive">
                    <a href="/">Postik</a>
                  </p>
                  <div className="dbuttons">
                    <NavLink to="/user" className="desktopbuttons">
                      Dashboard
                    </NavLink>
                    <NavLink to="/login" onClick={logOut} className="desktopbuttons">
                      LogOut
                    </NavLink>
                  </div>
                  <Button
                    variant="outline-light"
                    onClick={handleShow}
                    className="offcanbutton"
                  >
                    <i className="bi bi-list"></i>
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="linknavv">
                    Login
                  </NavLink>
                  <p className="postiklogoresponsive">
                    <a href="/">Postik</a>
                  </p>
                  <NavLink to="/register" className="linknavv">
                    SignUp
                  </NavLink>
                </>
              )}
            </Nav>
            {currentUser && (
              <Offcanvas
                show={show}
                onHide={handleClose}
                data-bs-theme="dark"
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title className="offtitle">
                    {storedUser.username}
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <ListGroup className="listgroup">
                    <ListGroupItem>
                      <NavLink to="/user" className="linkoffcanvas">
                        Dashboard
                      </NavLink>
                    </ListGroupItem>
                    <ListGroupItem variant="danger">
                      <NavLink onClick={logOut} className="linkoffcanvas">
                        LogOut
                      </NavLink>
                    </ListGroupItem>
                  </ListGroup>
                </Offcanvas.Body>
              </Offcanvas>
            )}
          </Navbar>
        </div>
      )}

      <div className="container-sm">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<Profile />} />
          <Route path="/for-everyone" element={<ForEveryone />} />
        </Routes>
      </div>

      <AuthVerify logOut={logOut} />
    </div>
  );
};

export default App;
