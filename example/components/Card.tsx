import * as React from "react";
import styled from "@emotion/styled";

export interface ICardProps {
  noPadding?: boolean;
  borderRadius?: number;
}

const Card = styled.section<ICardProps>`
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  padding: ${({ noPadding }) => (noPadding ? 0 : "1em")};
  background-color: white;
  overflow: hidden;
  min-width: 275px;
  font-family: inherit;
  border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius  }px` : 0)};
`;

const CardComp: React.FC<ICardProps> = props => <Card {...props}>{props.children}</Card>;

export default CardComp;
