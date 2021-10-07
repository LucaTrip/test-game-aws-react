import React, { useEffect, useContext, Dispatch, useState } from "react";
import { axiosInstance as apiService } from "../api/apiService";
import { Alert, ListGroup, Spinner } from "react-bootstrap";

import { GlobalActions, GlobalContext } from "../context/GlobalContext";

import "../styles/UserListStyle.css";

import CreateNewUser from "../components/CreateNewUser";
import InlineUser from "../components/InlineUser";
import { Types } from "../utils/reducers";
import { UserModel } from "../models/GeneralModels";

// FETCH ALL USERS IN THE TABLE FUNCTION
const fetchUsers = async (dispatch: Dispatch<GlobalActions>) => {
  try {
    const response: any = await apiService.get("/scanusers");
    console.log("[fetchUsers] success", response);

    let fetchedUsers: UserModel[] = Object.values(response.data);
    getUserImage(0, fetchedUsers, dispatch);
  } catch (error: any) {
    console.error("[fetchUsers] error", error.response);
    let errorMessage = "";

    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Sorry, the server is down. Please try later";
    }

    dispatch({ type: Types.handleError, payload: { errorMessage } });
  }
};

// RETRIVE RECURSIVE USERS IMAGE
const getUserImage = async (
  index: number,
  users: UserModel[],
  dispatch: Dispatch<GlobalActions>
) => {
  if (index < users.length) {
    let bucketUrl: any = await apiService.get("/getprofile", {
      params: { nickname: users[index].nickname },
      headers: { RemoveAuthHeader: "true" },
    });

    users[index].avatar = bucketUrl.data.url.split("?")[0];
    getUserImage(index + 1, users, dispatch);
  } else {
    dispatch({
      type: Types.saveUserList,
      payload: { items: users },
    });
  }
};

// MAIN COMPONENT
const UserListScreen = () => {
  const { state, dispatch } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch({ type: Types.clearAll });
    fetchUsers(dispatch).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="user-list-container">
      <CreateNewUser />

      <div className="list-container">
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" />
          </div>
        ) : null}

        <ListGroup variant="flush">
          {state.userList.length
            ? state.userList.map((_user) => (
                <InlineUser user={_user} key={_user.nickname} />
              ))
            : null}

          {!state.userList.length && !loading ? (
            <ListGroup.Item>
              <h4 className="no-users-yet">
                No users created yet. Create one!
              </h4>
            </ListGroup.Item>
          ) : null}
        </ListGroup>
      </div>

      {state.errorMessage ? (
        <Alert variant="danger">{state.errorMessage}</Alert>
      ) : null}
    </div>
  );
};

export default UserListScreen;
