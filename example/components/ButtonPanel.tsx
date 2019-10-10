import React from "react";
import styled from "@emotion/styled";

const Panel = styled.section`
  display: flex;
  justify-content: flex-end;
`;
const ButtonPanel = ({ children }) => {
  return <Panel>{children}</Panel>;
};

export default ButtonPanel;
