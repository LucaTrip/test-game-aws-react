import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import plusIcon from "../assets/img/add-outline.svg";

import "../styles/CreateNewUserStyle.css";

import { GlobalContext } from "../context/GlobalContext";
import { Types } from "../utils/reducers";

const CreateNewUser = () => {
  const { state, dispatch } = useContext(GlobalContext);

  let history = useHistory();

  return (
    <div className="button-container">
      <button
        onClick={() => {
          dispatch({ type: Types.clearAll });
          history.push("/createuser");
        }}
      >
        <img src={plusIcon} alt="" />
        <span>Add new user</span>
      </button>
    </div>
  );
};

export default CreateNewUser;
