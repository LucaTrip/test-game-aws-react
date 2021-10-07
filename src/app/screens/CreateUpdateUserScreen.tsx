import React, {
  useState,
  useContext,
  Dispatch,
  useEffect,
  useRef,
} from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Image } from "react-bootstrap";

import { axiosInstance as apiService } from "../api/apiService";
import { GlobalActions, GlobalContext } from "../context/GlobalContext";
import { Types } from "../utils/reducers";

import noUserIcon from "../assets/img/person-outline.svg";

// CREATE USER FUNCTION
const createUpdateUser = async (
  avatar: any,
  firstname: string,
  lastname: string,
  email: string,
  nickname: string,
  history: any,
  dispatch: Dispatch<GlobalActions>
) => {
  try {
    const response: any = await apiService.post("/registeruser", {
      firstname,
      lastname,
      email,
      nickname,
    });
    console.log("[createUpdateUser] success", response);

    // UPLOAD USER PROFILE IMAGE TO S3
    if (avatar) {
      const bucketUrl: any = await apiService.post(
        "/uploadprofile",
        {
          nickname,
        },
        { headers: { RemoveAuthHeader: "true" } }
      );
      console.log("[getBucketUrl] success", bucketUrl);

      const bucketResponse = await apiService.put(bucketUrl.data.url, avatar, {
        headers: {
          "Content-Type": "multipart/form-data",
          RemoveAuthHeader: "true",
        },
      });
      console.log("[sendAvatarImage] success", bucketResponse);
    }

    history.push("/home");
  } catch (error: any) {
    console.error("[createUpdateUser] error", error.response);
    let errorMessage = "";

    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Sorry, the server is down. Please try later";
    }

    dispatch({ type: Types.handleError, payload: { errorMessage } });
  }
};

// MAIN COMPONENT
const CreateUpdateUserScreen = () => {
  const { state, dispatch } = useContext(GlobalContext);

  const inputFile = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState(
    state.currentUserDetail ? state.currentUserDetail.avatar : null
  );

  const [firstname, setFirstName] = useState(
    state.currentUserDetail ? state.currentUserDetail.firstname : ""
  );
  const [lastname, setLastName] = useState(
    state.currentUserDetail ? state.currentUserDetail.lastname : ""
  );
  const [email, setEmail] = useState(
    state.currentUserDetail ? state.currentUserDetail.email : ""
  );
  const [nickname, setNickName] = useState(
    state.currentUserDetail ? state.currentUserDetail.nickname : ""
  );

  const [loading, setLoading] = useState(false);

  let submitButtonText = "Create user";
  if (state.currentUserDetail) {
    submitButtonText = "Update user";
  }

  let formattedAvatar = "";
  if (typeof avatar === "string") {
    formattedAvatar = avatar;
  } else if (avatar) {
    formattedAvatar = URL.createObjectURL(avatar);
  }

  let history = useHistory();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    createUpdateUser(
      avatar!,
      firstname,
      lastname,
      email,
      nickname,
      history,
      dispatch
    ).finally(() => setLoading(false));
  };

  const handleFileUpload = (e: any) => {
    const { files } = e.target;

    if (files && files.length) {
      setAvatar(files[0]);
    }
  };

  const onSelectInput = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  useEffect(() => {
    dispatch({ type: Types.clearErrorMessage });
  }, []);

  return (
    <div className="align">
      <div className="grid">
        <div className="avatar-form-container">
          <div>
            {formattedAvatar.length ? (
              <Image className="avatar" src={formattedAvatar} roundedCircle />
            ) : (
              <div className="fake-rounded-image">
                <img className="fake-img" src={noUserIcon} alt="" />
              </div>
            )}
          </div>
          <div className="upload-image-container">
            <input
              style={{ display: "none" }}
              ref={inputFile}
              onChange={handleFileUpload}
              type="file"
              accept="image/*"
            />

            <button
              type="button"
              className="button-image"
              onClick={onSelectInput}
            >
              Upload avatar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form login">
          <div className="form__field">
            <label htmlFor="login__email">
              <span>First name </span>
              <svg className="icon">
                <use xlinkHref="#icon-user"></use>
              </svg>
            </label>
            <input
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              id="login__email"
              type="text"
              name="firstname"
              className="form__input"
              placeholder="First name"
              required
            />
          </div>

          <div className="form__field">
            <label htmlFor="login__email">
              <span>Last name </span>
              <svg className="icon">
                <use xlinkHref="#icon-user"></use>
              </svg>
            </label>
            <input
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              id="login__email"
              type="text"
              name="lastname"
              className="form__input"
              placeholder="Last name"
              required
            />
          </div>

          <div className="form__field">
            <label htmlFor="login__email">
              <span>Email </span>
              <svg className="icon">
                <use xlinkHref="#icon-user"></use>
              </svg>
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
            <label htmlFor="login__email">
              <span>Nickname </span>
              <svg className="icon">
                <use xlinkHref="#icon-user"></use>
              </svg>
            </label>
            <input
              value={nickname}
              onChange={(e) => setNickName(e.target.value)}
              id="login__email"
              type="text"
              name="nickname"
              className="form__input"
              placeholder="Nickname"
              disabled={state.currentUserDetail ? true : false}
              required
            />
          </div>

          <div className="form__field">
            {!loading ? (
              <input type="submit" value={submitButtonText} />
            ) : (
              <Button className="login-signup-button" disabled>
                <span>Update User </span>
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
      </div>

      {state.errorMessage ? (
        <Alert variant="danger">{state.errorMessage}</Alert>
      ) : null}

      <svg xmlns="http://www.w3.org/2000/svg" className="icons">
        <symbol id="icon-user" viewBox="0 0 1792 1792">
          <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
        </symbol>
      </svg>
    </div>
  );
};

export default CreateUpdateUserScreen;
