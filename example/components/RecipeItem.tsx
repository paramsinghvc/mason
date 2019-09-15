import React from "react";
import styled from "@emotion/styled";

import LinkIcon from "~assets/broken-link.svg";
import FoodIcon from "~assets/food.svg";

const RecipeItemHolder = styled.section`
  display: grid;
  border: 2px solid grey;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 20px;
  &:last-of-type {
    margin-bottom: 0;
  }
  grid-template-rows: auto 25px;
  grid-template-columns: 80px auto;
  grid-column-gap: 20px;
  > img.thumbnail {
    grid-row: 1/3;
    height: 80px;
  }
`;

const Link = styled.a`
  grid-row: 2/3;
  grid-column: 2/3;
  align-self: end;
  justify-self: end;
  > img {
    width: 20px;
    cursor: pointer;
  }
`;
const InfoSection = styled.section`
  grid-column: 2/3;
  grid-row: 1/2;
  > h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
  }
  > .ingredients {
    font-size: 12px;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  ul.tags {
    list-style: none;
    display: flex;
    font-size: 12px;
    flex-wrap: wrap;
    padding: 0;
    > li {
      padding: 4px 5px;
      border: 2px solid grey;
      border-radius: 3px;
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
`;

const RecipeItem = ({ data }: any) => {
  return (
    <RecipeItemHolder>
      <img className="thumbnail" src={data.image || FoodIcon} />
      <InfoSection>
        <h3>{data.label}</h3>
        <ul className="tags">
          {data.healthLabels.map(label => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <p className="ingredients">
          <strong>Ingredients:</strong> {data.ingredientLines.join(", ")}
        </p>
      </InfoSection>
      <Link href={data.url} target="_blank">
        <img src={LinkIcon} />
      </Link>
    </RecipeItemHolder>
  );
};

export default RecipeItem;
