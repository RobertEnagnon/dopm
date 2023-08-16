import {NavLink, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {useDopm} from "../../context/dopm.context";
import {Badge} from "reactstrap";

type SidebarItemProps = {
    name: string,
    badgeColor: string | undefined,
    badgeText: string | undefined
    icon?: IconDefinition | undefined,
    to: string,
    className?: string,
}

const SidebarItem = ({ name, badgeColor, badgeText, icon, to, className } : SidebarItemProps) => {
    const dopm = useDopm();
    const location = useLocation();

    const getSidebarItemClass = ( path: string ) => {
        return location.pathname === path ? "active" : "";
    }
    const handleClickItemSidebar = () => {
        dopm.toggleSidebar()
    }

    return (
        <li
            className={`sidebar-item ${getSidebarItemClass(to)} ${className}`}
            onClick={() => handleClickItemSidebar()}
        >
            <NavLink to={to} className={(navData) => `sidebar-link ${navData.isActive ? 'active' : ''}`}>
                {icon ?
                    <>
                        <FontAwesomeIcon icon={icon} className="align-middle" />
                        <span className="align-middle">{name}</span>
                    </> : name
                }
                {badgeColor && badgeText ?
                    <Badge color={badgeColor} size={18} pill className="sidebar-badge">
                        {badgeText}
                    </Badge> : null
                }
            </NavLink>
        </li>
    )
}

export default SidebarItem;
