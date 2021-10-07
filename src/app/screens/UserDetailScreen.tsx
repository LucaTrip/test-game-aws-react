import React, { Dispatch, useContext, useEffect } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";

import { axiosInstance as apiService } from "../api/apiService";
import { UserModel } from "../models/GeneralModels";

import "../styles/UserDetailStyle.css";

import { GlobalActions, GlobalContext } from "../context/GlobalContext";

import noUserIcon from "../assets/img/person-outline.svg";
import { Types } from "../utils/reducers";

const getUserProfile = async (
  nickname: string,
  dispatch: Dispatch<GlobalActions>
) => {
  try {
    const response: any = await apiService.get("/userinfo", {
      params: { nickname },
    });
    console.log("[getUserProfile] success", response);

    let user: UserModel = response.data;
    let bucketUrl: any = await apiService.get("/getprofile", {
      params: { nickname },
      headers: { RemoveAuthHeader: "true" },
    });
    user.avatar = bucketUrl.data.url.split("?")[0];

    dispatch({ type: Types.saveCurrentUserDetail, payload: { ...user } });
  } catch (error: any) {
    console.error("[getUserProfile] error", error.response);
    let errorMessage = "";

    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Sorry, the server is down. Please try later";
    }

    dispatch({ type: Types.handleError, payload: { errorMessage } });
  }
};

const UserDetailScreen = () => {
  const { state, dispatch } = useContext(GlobalContext);

  let history = useHistory();
  let params: any = useParams();

  useEffect(() => {
    if (params.nickname) getUserProfile(params.nickname, dispatch);
  }, []);

  return (
    <div className="user-card-container">
      {state.currentUserDetail ? (
        <Card style={{ width: "18rem" }}>
          <Card.Img
            variant="top"
            src={state.currentUserDetail?.avatar || noUserIcon}
          />
          <Card.Body>
            <Card.Title>
              {state.currentUserDetail!.firstname}{" "}
              {state.currentUserDetail!.lastname}
              <span className="alias"> alias </span>
              {state.currentUserDetail!.nickname}
            </Card.Title>

            <Card.Title>{state.currentUserDetail!.email}</Card.Title>

            <div className="edit-button-container">
              <Button
                onClick={() => {
                  history.push("/createuser");
                }}
              >
                Edit profile
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div className="spinner-container">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </div>
  );
};

export default UserDetailScreen;
