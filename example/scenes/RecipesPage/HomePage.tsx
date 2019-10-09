import React from "react";
import styled from "@emotion/styled";

import config from "~configs/RecipesPage.json";
import { ReactConfigRenderer } from "../../../src";
import TextField from "~components/TextField";
import Recipes, { dataSourceProcessor as recipeDataSourceProcessor } from "./Recipes";

const Holder = styled.main`
  margin: 10vh auto;
  min-width: 400px;
  width: 60%;
`;

const HomePageLayout = ({ children }: any) => {
  return <Holder>{children}</Holder>;
};

const homePageRenderer = new ReactConfigRenderer(
  config,
  new Map([["PAGE_LAYOUT", HomePageLayout], ["SEARCH_INPUT", TextField], ["RECIPES_LIST_GROUP", Recipes]]),
  {
    dataProcessors: {
      recipeDataSourceProcessor
    },
    onStateChange(state) {
      // eslint-disable-next-line no-console
      console.log(state);
    }
  }
);

export { homePageRenderer };
export default HomePageLayout;
