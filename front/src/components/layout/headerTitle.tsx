import {ElementType, HTMLAttributes} from "react";


type HeaderTitleProps = {
  children?: any,
  tag: ElementType,
  rest?: HTMLAttributes<any>
}

const defaultProps: HeaderTitleProps = {
  tag: "h1",
}

const HeaderTitle = ({ children, tag: Tag, ...rest} : HeaderTitleProps) : JSX.Element => {
  return <Tag className={"header-title"} {...rest}>{children}</Tag>
}
HeaderTitle.defaultProps = defaultProps;

export default HeaderTitle;