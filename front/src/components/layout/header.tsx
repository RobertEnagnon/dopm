import React, {ElementType, HTMLAttributes} from "react";

type HeaderProps = {
  children?: any,
  tag: ElementType,
  rest?: HTMLAttributes<any>
}

const defaultProps: HeaderProps = {
  tag: "div"
}

const Header = ({ children, tag: Tag, ...rest } : HeaderProps) => {
  return <Tag className={"header"} {...rest}>{children}</Tag>
}
Header.defaultProps = defaultProps


export default Header;
