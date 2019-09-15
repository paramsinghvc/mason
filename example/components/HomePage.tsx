import React from "react";
import styled from "@emotion/styled";

import config from "~configs/RecipesPage.json";
import { ReactConfigRenderer } from "../../src";
import Search from "./Search";
import Recipes, { dataSourceProcessor as recipeDataSourceProcessor } from "./Recipes";

const Holder = styled.main`
  margin: 10vh auto;
  min-width: 400px;
  width: 60vw;
`;

const HomePageLayout = ({ children }: any) => {
  return <Holder>{children}</Holder>;
};

const homePageRenderer = new ReactConfigRenderer(
  config,
  new Map([["PAGE_LAYOUT", HomePageLayout], ["SEARCH_INPUT", Search], ["RECIPES_LIST_GROUP", Recipes]]),
  {
    dataProcessors: {
      recipeDataSourceProcessor
    }
  }
);

export { homePageRenderer };
export default HomePageLayout;
