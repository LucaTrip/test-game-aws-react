import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { GlobalProvider } from "./app/context/GlobalContext";
import PublicRoute from "./app/routers/PublicRoute";
import PrivateRoute from "./app/routers/PrivateRoute";

import Nav from "./app/components/Nav";
import LoginSignupScreen from "./app/screens/LoginSignupScreen";
import UserListScreen from "./app/screens/UserListScreen";
import CreateUpdateUserScreen from "./app/screens/CreateUpdateUserScreen";
import UserDetailScreen from "./app/screens/UserDetailScreen";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="App">
          <Nav />

          <Switch>
            <PublicRoute path="/login" component={LoginSignupScreen} />
            <PublicRoute path="/signup" component={LoginSignupScreen} />
            <PrivateRoute path="/home" component={UserListScreen} />
            <PrivateRoute
              path="/createuser"
              component={CreateUpdateUserScreen}
            />
            <PrivateRoute
              path="/userdetail/:nickname"
              component={UserDetailScreen}
            />
            <PrivateRoute path="/" component={UserListScreen} />
          </Switch>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
