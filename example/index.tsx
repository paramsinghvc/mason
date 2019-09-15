import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    onlyLogs: true,
    titleColor: "green",
    // logOnDifferentValues: true,
    diffNameColor: "darkturquoise"
  });
}

ReactDOM.render(<App />, document.getElementById("app"));
