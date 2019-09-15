import React from "react";
import { css, Global } from "@emotion/core";

import { homePageRenderer } from "./HomePage";

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
      {homePageRenderer.render()}
    </>
  );
};

App.whyDidYouRender = true;
export default App;
