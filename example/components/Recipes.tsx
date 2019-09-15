import React from "react";

import RecipeItem from "./RecipeItem";
import { css, keyframes } from "@emotion/core";

const holder = css`
  border-radius: 10px;
  box-shadow: 0 0 22px rgba(0, 0, 0, 0.3);
  display: block;
  padding: 20px;
  height: 80vh;
  overflow-y: auto;
`;

const ripple = keyframes`
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
`;

const rippleCSS = css`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  margin: 20% auto;
  left: 50%;
  margin-left: -32px;

  div {
    position: absolute;
    border: 4px solid grey;
    opacity: 1;
    border-radius: 50%;
    animation: ${ripple} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    &:nth-of-type(2) {
      animation-delay: -0.5s;
    }
  }
`;

export const dataSourceProcessor = dataSource => {
  return dataSource.hits.map(h => h.recipe);
};

const Recipes = ({ datasource, loading }: any) => {
  const dataSource = datasource || [];

  return (
    <main css={holder}>
      {loading ? (
        <section css={rippleCSS}>
          <div></div>
          <div></div>
        </section>
      ) : (
        dataSource.map(i => <RecipeItem key={i.uri} data={i} />)
      )}
    </main>
  );
};

export default Recipes;
