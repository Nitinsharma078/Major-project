// login page

import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { showData } from "../Redux/Action/action";
import "./Login.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.subReducer.tasks);
  const data1 = useSelector((state) => state)
  console.log("da",data1);
  console.log("us",data);
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [UserIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const valid = useSelector((state) => state.Register.users);
  // console.log(valid);

  useEffect(() => {
    if(!data.length){
      dispatch(showData());
    }

  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (userId === '') {
      setUserIdError("Enter email id");
      isValid = false;
    } else {
      setUserIdError("");
    }

    if (password === '') {
      setPasswordError("Password cannot be blank");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      return;
    }

    await Promise.resolve();

    let UserFound = false;
    let loggedInUser = null;

    data.forEach(item => {

      if (item.email === userId && item.password === password) {
        UserFound = true;
        loggedInUser = item;
      }
    });



    if (UserFound) {
      setUserIdError("");
      setPasswordError("");
      localStorage.setItem("token",Math.random());
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      navigate("/dashboard", { state: { user: loggedInUser } });
    } else {
      setUserIdError("Invalid userId !");
      setPasswordError("Invalid password !");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="main">
      <div className="loginP">
        <div className="login">
          <h1>Login</h1>
          <Form onSubmitCapture={handleSubmit}>
            <div className="user">
              <label className="label">Email Id</label>
              <Input
                type="text"
                className="input"
                placeholder="Enter email"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              {<span className="error">{UserIdError && UserIdError}</span>}
              {/* <br /> */}
              <label className="label">Password</label>
              <Input
                type="password"
                className="input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {<span className="error">{passwordError && passwordError}</span>}

            </div>
            <div className="button-login">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            <Button onClick={handleRegister} className="Register">
              SignUp
            </Button>
            </div>

          </Form>
        </div>
      </div>
    </div>
  );
};
export default Login;