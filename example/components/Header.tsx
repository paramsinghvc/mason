import * as React from "react";

const Header: React.FC<{
  text: string;
}> = ({ text, ...props }) => {
  return <h2 {...props}>{text}</h2>;
};

export default React.memo(Header);
