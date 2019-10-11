import React, { FC } from "react";
import styled from "@emotion/styled";

export type buttonSizeType = "small" | "medium" | "large" | "x-large";
export interface IButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  rounded?: boolean;
  variant?: "default" | "flat" | "outlined";
  fullWidth?: boolean;
  size?: buttonSizeType;
  color?: string;
  textColor?: string;
  highlightColor?: string;
  disabledColor?: string;
}

const resolveBgColor = ({ variant, color }: IButtonProps) => {
  if (variant === "flat" || variant === "outlined") {
    return "transparent";
  }
  return color;
};

const sizeMap = new Map<buttonSizeType, string>([
  ["small", "5px 15px"],
  ["medium", "10px 20px"],
  ["large", "15px 25px"],
  ["x-large", "20px 40px"]
]);

const defaultProps = {
  variant: "default",
  rounded: false,
  size: "large",
  color: "#7b68ee",
  highlightColor: "#5b43ea",
  disabledColor: "#d5d5d5",
  textColor: "#ffffff"
} as Partial<IButtonProps>;

const Button = styled.button<IButtonProps & Partial<typeof defaultProps>>`
  padding: ${({ size }) => sizeMap.get(size!)};
  text-align: center;
  background-color: ${resolveBgColor};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  font-size: 1em;
  color: ${({ variant, color, textColor }) => (variant === "flat" || variant === "outlined" ? color : textColor)};
  border: ${({ variant, color }) => (variant === "outlined" ? `1px solid ${color}` : "none")};
  cursor: pointer;
  border-radius: ${({ rounded }) => (rounded ? "4px" : 0)};
  &[disabled] {
    background-color: ${({ disabledColor }) => disabledColor};
  }
  transition: all 0.2s;
  &:hover {
    background-color: ${({ color, highlightColor, variant }) =>
      variant === "outlined" || variant === "flat" ? color : highlightColor};
    color: ${({ textColor }) => textColor};
  }
`;

const ButtonComp: FC<IButtonProps> = props => (
  <Button onClick={props.onClick} {...props}>
    {props.children || props.label}
  </Button>
);

ButtonComp.defaultProps = defaultProps;

export default ButtonComp;
