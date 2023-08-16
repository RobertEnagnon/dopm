import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";

type Props = {
    children: ReactNode;
}

type DopmContextType = {
    isSidebarOpen: boolean,
    isSidebarOnRight: boolean,
    toggleSidebar: () => any,
    isMobileDevice: boolean
}

const DopmContextDefaultValues: DopmContextType = {
    isSidebarOpen: true,
    isSidebarOnRight: false,
    toggleSidebar: () => {},
    isMobileDevice: false
}

export const DopmContext = createContext<DopmContextType>(DopmContextDefaultValues);

export function useDopm() {
    return useContext(DopmContext)
}

export function DopmProvider( { children } : Props ) {
    const MOBILE_MAX_WIDTH = 600;

    const [ isSidebarOpen, setSidebarOpen ] = useState<boolean>( DopmContextDefaultValues.isSidebarOpen );
    const [ isSidebarOnRight, setSidebarOnRight ] = useState<boolean>( DopmContextDefaultValues.isSidebarOnRight );

    const [isMobileDevice, setIsMobileDevice] = useState<boolean>(window.innerWidth <= MOBILE_MAX_WIDTH);
    const detectSize = () => {
        setIsMobileDevice(window.innerWidth <= MOBILE_MAX_WIDTH);
    };

    useEffect(() => {
        window.addEventListener("resize", detectSize);
    }, []);

    const value = useMemo(() => ({
        isSidebarOpen: isSidebarOpen,
        setSidebarOpen,
        isSidebarOnRight: isSidebarOnRight,
        setSidebarOnRight,
        toggleSidebar,
        isMobileDevice
    }), [ isSidebarOpen, isSidebarOnRight, isMobileDevice ] );

    function toggleSidebar() {
        setSidebarOpen( !isSidebarOpen );
    }

    return (
        <>
            <DopmContext.Provider value={value}>
                {children}
            </DopmContext.Provider>
        </>
    )
}