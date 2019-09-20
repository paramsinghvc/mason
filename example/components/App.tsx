import React, { useCallback, useState } from "react";
import { css, Global } from "@emotion/core";

import { homePageRenderer } from "./HomePage";

const button = css`
  border: 2px solid grey;
  border-radius: 3px;
  padding: 15px 25px;
  font-size: 16px;
  width: fit-content;
`;

const mainHolder = css`
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  justify-content: space-around;
`;

const buttonsSection = css`
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  justify-content: center;
  grid-row-gap: 20px;
`;

const snapshotContainer = css`
  ${button}
  font-size: 14px;
`;

const App = () => {
  const [valuesSnapshot, setValuesSnapshot] = useState();

  const handleGetCurrentValuesSnapshot = useCallback(() => {
    setValuesSnapshot(JSON.stringify(homePageRenderer.getCurrentValuesSnapshot(), undefined, 4));
  }, [homePageRenderer]);

  const handleSetValue = useCallback(() => {
    homePageRenderer.setValue(new Map([["firstSearchInput", "pasta"]]));
  }, [homePageRenderer]);

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
      <main css={mainHolder}>
        <section css={buttonsSection}>
          <button css={button} onClick={handleGetCurrentValuesSnapshot}>
            Get Current Values Snapshot
          </button>
          {valuesSnapshot && <section css={snapshotContainer}>{valuesSnapshot}</section>}
          <button css={button} onClick={handleSetValue}>
            Set Value
          </button>
        </section>
        <section>{homePageRenderer.render()}</section>
      </main>
    </>
  );
};

App.whyDidYouRender = true;
export default App;
