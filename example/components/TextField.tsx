import React, { memo } from "react";
import styled from "@emotion/styled";

const TextInput = styled.input`
  border: 2px solid grey;
  border-radius: 3px;
  padding: 15px 25px;
  font-size: 16px;
  width: 100%;
`;

const ErrorsText = styled.div`
  color: #f5222d;
  font-size: 12px;
  > p {
    margin-bottom: 5px;
  }
`;

// eslint-disable-next-line no-unused-vars
const TextField = ({ children, value, validations, ...props }: any) => {
  return (
    <>
      <TextInput value={value} {...props} />
      {validations && validations.hasErrors && (
        <ErrorsText>
          {Object.entries(validations.errors)
            .filter(([, value]) => Boolean(value))
            .map(([key, value]) => (
              <p key={key}>{value}</p>
            ))}
        </ErrorsText>
      )}
    </>
  );
};

export default memo(TextField);
