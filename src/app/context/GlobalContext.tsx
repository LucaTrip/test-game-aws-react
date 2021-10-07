/**
 * This is the global Context that permit me to share the data to the children
 */
import React, { createContext, Dispatch, useReducer } from "react";

import { UserModel } from "../models/GeneralModels";
import { ActionMap, Types } from "../utils/reducers";

interface InitialStateType {
  currentUserDetail: UserModel | null;
  userList: UserModel[];
  errorMessage: string | null;
}

interface CustomContext {
  state: InitialStateType;
  dispatch: Dispatch<GlobalActions>;
}

type GlobalPayload = {
  [Types.saveCurrentUserDetail]: {
    firstname: string;
    lastname: string;
    email: string;
    nickname: string;
    avatar: string;
  };
  [Types.saveUserList]: {
    items: UserModel[];
  };
  [Types.handleError]: {
    errorMessage: string;
  };
  [Types.clearErrorMessage]: {};
  [Types.clearAll]: {};
};

export type GlobalActions =
  ActionMap<GlobalPayload>[keyof ActionMap<GlobalPayload>];

const initialState: InitialStateType = {
  currentUserDetail: null,
  userList: [],
  errorMessage: null,
};

const defaultDispatch: Dispatch<GlobalActions> = () => null;

const GlobalContext = createContext<CustomContext>({
  state: initialState,
  dispatch: defaultDispatch,
});

const globalReducer = (state: InitialStateType, action: GlobalActions) => {
  switch (action.type) {
    case Types.saveCurrentUserDetail:
      return {
        ...state,
        currentUserDetail: {
          firstname: action.payload!.firstname,
          lastname: action.payload!.lastname,
          email: action.payload!.email,
          nickname: action.payload!.nickname,
          avatar: action.payload?.avatar || "",
        },
        errorMessage: null,
      };

    case Types.saveUserList:
      return {
        ...state,
        userList: action.payload!.items.map((_user) => _user),
      };

    case Types.handleError:
      return { ...state, errorMessage: action.payload!.errorMessage };

    case Types.clearErrorMessage:
      return { ...state, errorMessage: null };

    case Types.clearAll:
      return { ...state, errorMessage: null, currentUserDetail: null };

    default:
      return state;
  }
};

const GlobalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
