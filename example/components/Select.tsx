import * as React from "react";
import styled from "@emotion/styled";

type KeyValue = { key: string | number; value: string | number };
type OptionType = KeyValue | string | number;
type SelectProps = {
  datasource: Array<OptionType>;
  onChange: (event: React.ChangeEvent, value: string | number) => void;
  value: string | number;
};

function checkIfObject(option: OptionType): option is KeyValue {
  return Object.prototype.toString.call(option) === "[object Object]";
}

const SelectBox = styled.select`
  border: 2px solid grey;
  height: 40px;
  font-size: 18px;
  min-width: 122px;
  background: transparent;
`;

const Select: React.FC<SelectProps> = ({ datasource = [], value, onChange, ...props }) => {
  const handleChange = React.useCallback(
    e => {
      onChange(e, e.target.value);
    },
    [onChange]
  );
  return (
    <SelectBox onChange={handleChange} value={value} {...props}>
      {datasource.map((datum, index) => (
        <option key={checkIfObject(datum) ? datum.key : index} value={!checkIfObject(datum) ? datum : datum.value}>
          {!checkIfObject(datum) ? datum : datum.value}
        </option>
      ))}
    </SelectBox>
  );
};

export default Select;
