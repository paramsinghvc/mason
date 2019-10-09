import React from "react";
import styled from "@emotion/styled";

const TextInput = styled.input`
  border: 2px solid grey;
  border-radius: 3px;
  padding: 15px 25px;
  font-size: 16px;
  width: 100%;
`;

// eslint-disable-next-line no-unused-vars
const TextField = ({ children, value, ...props }: any) => {
  return <TextInput value={value} {...props} />;
};

export default TextField;
