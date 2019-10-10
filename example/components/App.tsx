import React from "react";
import { css, Global } from "@emotion/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import RecipesPage from "../scenes/RecipesPage";
import Form from "../scenes/Form";
import LoginForm from "../scenes/LoginForm";

const App = () => {
  return (
    <>
      <Global
        styles={css`
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont;
          }
        `}
      />
      <Router>
        <Switch>
          <Route path="/" component={RecipesPage} exact />
          <Route path="/form" component={Form} />
          <Route path="/login-form" component={LoginForm} />
        </Switch>
      </Router>
    </>
  );
};

App.whyDidYouRender = true;
export default App;
