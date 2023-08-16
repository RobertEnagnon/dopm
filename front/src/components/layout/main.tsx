
type MainProps = {
    children: any,
    className?: any
}

const Main = ({ children, className } : MainProps) => {
    return <div className={`main ${className}`}>{children}</div>
}

export default Main