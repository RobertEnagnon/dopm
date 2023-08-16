type ContentProps = {
    children: any
}


const Content = ({ children }: ContentProps) => {
    return <div className={'content'}>{children}</div>
}

export default Content;
