type WrapperProps = {
    children: any
}

const Wrapper = ({ children } : WrapperProps) => {
    return <div className={`wrapper`}>{children}</div>
}

export default Wrapper;