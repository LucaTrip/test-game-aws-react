import React from "react";
import { useHistory } from "react-router-dom";
import { Image, ListGroup } from "react-bootstrap";

import { UserModel } from "../models/GeneralModels";

import "../styles/InlineUserStyle.css";

import arrowIcon from "../assets/img/chevron-forward-outline.svg";
import noUserIcon from "../assets/img/person-outline.svg";

type Props = {
  user: UserModel;
};

const InlineUser: React.FC<Props> = ({ user }) => {
  let history = useHistory();

  return (
    <ListGroup.Item
      action
      className="inline-user-container"
      onClick={() => {
        history.push(`/userdetail/${user.nickname}`);
      }}
    >
      <div className="left-container">
        <div className="avatar-container">
          {user.avatar ? (
            <Image className="avatar" src={user.avatar} roundedCircle />
          ) : (
            <div className="fake-rounded-image sm">
              <img className="fake-img" src={noUserIcon} alt="" />
            </div>
          )}
        </div>

        <div className="user-container">
          <h3 className="title">{user.nickname}</h3>
        </div>
      </div>

      <div className="arrow-container">
        <img src={arrowIcon} alt="" />
      </div>
    </ListGroup.Item>
  );
};

export default InlineUser;
