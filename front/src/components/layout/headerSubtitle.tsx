import React, {ElementType, HTMLAttributes} from "react";

type HeaderSubtitleProps = {
  children?: any,
  tag: ElementType,
  rest?: HTMLAttributes<any>,
  className?: any
};

const defaultProps: HeaderSubtitleProps = {
  tag: "p"
}

const HeaderSubtitle = ({ children, className, tag: Tag, ...rest } : HeaderSubtitleProps) : JSX.Element => (
  <Tag className={`header-subtitle ${className}`} {...rest}>
    {children}
  </Tag>
);
HeaderSubtitle.defaultProps = defaultProps;

export default HeaderSubtitle;
