import React, { useState, useContext, Dispatch } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import { axiosInstance as apiService } from "../api/apiService";

import { GlobalActions, GlobalContext } from "../context/GlobalContext";
import "../styles/LoginSignupFormStyle.css";
import { Types } from "../utils/reducers";

/* type Props = {
  typeOfForm: string;
}; */

// LOGIN FUNCTION
const login = async (
  email: string,
  password: string,
  history: any,
  dispatch: Dispatch<GlobalActions>
) => {
  try {
    const response: any = await apiService.post("/login", {
      email,
      password,
    });
    console.log("[login] success", response);
    sessionStorage.setItem("token", response.data.token);

    history.push("/home");
  } catch (error: any) {
    console.error("[login] error", error.response);
    let errorMessage = "";

    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Sorry, the server is down. Please try later";
    }

    dispatch({ type: Types.handleError, payload: { errorMessage } });
  }
};

// SIGNUP FUNCTION
const signup = async (
  email: string,
  password: string,
  history: any,
  dispatch: Dispatch<GlobalActions>
) => {
  try {
    const response: any = await apiService.post("/register", {
      email,
      password,
    });
    console.log("[signup] success", response);
    sessionStorage.setItem("token", response.data.token);

    history.push("/home");
  } catch (error: any) {
    console.error("[signup] error", error.response);
    let errorMessage = "";

    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Sorry, the server is down. Please try later";
    }

    dispatch({ type: Types.handleError, payload: { errorMessage } });
  }
};

// DISPATCH ERROR
const clearErrorMessage = (dispatch: Dispatch<GlobalActions>) =>
  dispatch({ type: Types.clearErrorMessage });

// MAIN COMPONENT
const LoginSignupScreen = () => {
  let typeOfForm = "login";

  let location = useLocation();
  if (location.pathname === "/signup") typeOfForm = "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  const { state, dispatch } = useContext(GlobalContext);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    clearErrorMessage(dispatch);

    setLoading(true);

    if (typeOfForm === "login")
      login(email, password, history, dispatch).finally(() =>
        setLoading(false)
      );
    if (typeOfForm === "signup")
      signup(email, password, history, dispatch).finally(() =>
        setLoading(false)
      );
  };

  return (
    <div className="align">
      <div className="grid">
        <form onSubmit={handleSubmit} className="form login">
          <div className="form__field">
            <label htmlFor="login__email">
              <svg className="icon">
                <use xlinkHref="#icon-user"></use>
              </svg>
              <span className="hidden">Email</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="login__email"
              type="text"
              name="email"
              className="form__input"
              placeholder="Email"
              required
            />
          </div>

          <div className="form__field">
            <label htmlFor="login__password">
              <svg className="icon">
                <use xlinkHref="#icon-lock"></use>
              </svg>
              <span className="hidden">Password</span>
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="login__password"
              type="password"
              name="password"
              className="form__input"
              placeholder="Password"
              required
            />
          </div>

          <div className="form__field">
            {!loading ? (
              <input
                type="submit"
                value={typeOfForm === "login" ? "Log In" : "Sign up"}
              />
            ) : (
              <Button className="login-signup-button" disabled>
                {typeOfForm === "login" ? "Log In " : "Sign up "}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>
        </form>

        <p className="text--center">
          {typeOfForm === "login" ? (
            <span>
              Not a member?{" "}
              <Link to="/signup" onClick={() => clearErrorMessage(dispatch)}>
                Sign up now
              </Link>{" "}
            </span>
          ) : (
            <span>
              Already a member?{" "}
              <Link to="/login" onClick={() => clearErrorMessage(dispatch)}>
                Sign in now
              </Link>{" "}
            </span>
          )}

          <svg className="icon">
            <use xlinkHref="#icon-arrow-right"></use>
          </svg>
        </p>
      </div>

      {state.errorMessage ? (
        <Alert variant="danger">{state.errorMessage}</Alert>
      ) : null}

      <svg xmlns="http://www.w3.org/2000/svg" className="icons">
        <symbol id="icon-arrow-right" viewBox="0 0 1792 1792">
          <path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" />
        </symbol>
        <symbol id="icon-lock" viewBox="0 0 1792 1792">
          <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
        </symbol>
        <symbol id="icon-user" viewBox="0 0 1792 1792">
          <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
        </symbol>
      </svg>
    </div>
  );
};

export default LoginSignupScreen;
