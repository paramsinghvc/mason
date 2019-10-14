import * as React from "react";
import styled from "@emotion/styled";

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: ${props => (props.checked ? "#7b68ee" : "transparent")};
  border: ${props => (!props.checked ? "2px solid #7b68ee" : "none")};
  border-radius: 3px;
  transition: all 150ms;
  > svg {
    visibility: ${props => (props.checked ? "visible" : "hidden")};
  }
`;

const LabelText = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  > span.label-text {
    margin-left: 10px;
  }
`;

const Checkbox: React.FC<{
  value: boolean;
  onChange: (event: React.ChangeEvent, value: boolean) => void;
  label?: string;
}> = ({ value, onChange, ...props }) => {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent) => {
      onChange(event, !value);
    },
    [onChange, value]
  );

  return (
    <CheckboxContainer>
      <LabelText>
        <HiddenCheckbox type="checkbox" {...props} checked={value} onChange={handleChange} />

        <StyledCheckbox checked={value}>
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        </StyledCheckbox>
        <span className="label-text">{props.label}</span>
      </LabelText>
    </CheckboxContainer>
  );
};

export default React.memo(Checkbox);
