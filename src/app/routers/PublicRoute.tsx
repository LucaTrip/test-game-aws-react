import React from "react";
import { Redirect, Route } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }: any) => {
  const token = sessionStorage.getItem("token");

  return (
    <Route
      {...rest}
      render={(props) => {
        return !token ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/home" }} />
        );
      }}
    />
  );
};

export default PublicRoute;
