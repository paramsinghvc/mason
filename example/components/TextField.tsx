import * as React from "react";
import styled from "@emotion/styled";
import { State } from "@mollycule/mason";

const ErrorsText = styled.div`
  color: #f5222d;
  font-size: 12px;
  > p {
    margin-bottom: 5px;
  }
`;

const TextInput = styled.input`
  border: 2px solid grey;
  border-radius: 3px;
  padding: 15px 25px;
  font-size: 16px;
  width: 100%;
`;

const TextArea = styled.textarea`
  border: 2px solid grey;
  border-radius: 3px;
  padding: 15px 25px;
  font-size: 16px;
  width: 100%;
`;

const TextField: React.FC<{
  value: string;
  validations: State.validations;
  multiline?: boolean;
}> = ({ children, value, validations, multiline, ...props }) => {
  return (
    <>
      {multiline ? <TextArea value={value} {...props} /> : <TextInput value={value} {...props} />}
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

export default React.memo(TextField);
