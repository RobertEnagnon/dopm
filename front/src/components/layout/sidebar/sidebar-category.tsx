import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Badge, Collapse} from "reactstrap";
import {useLocation} from "react-router-dom";

type SidebarCategoryProps = {
    name: string,
    badgeColor: string | undefined,
    badgeText: string | undefined,
    icon: IconDefinition | undefined,
    isOpen: boolean,
    children: any,
    onClick: any,
    to: string
}

const SidebarCategory = ({
   name,
   badgeColor,
   badgeText,
   icon,
   isOpen,
   children,
   onClick,
   to
} : SidebarCategoryProps) : JSX.Element => {
    const location = useLocation();

    const getSidebarItemClass = ( path: string ) => {
        return location?.pathname?.indexOf( path ) !== -1
          || (location?.pathname.includes('dashboard') && ((path || "").includes('dashboard') || path === undefined))
          || (location?.pathname.includes('Assignation') && (path || "").includes('Assignation'))
            ? "active" : "";
    }

    return (
        <li className={`sidebar-item ${getSidebarItemClass(to)} ${!children.length && to.includes('dashboard') ? 'disabled' : '' }`}>
            <span
                data-toggle="collapse"
                className={`sidebar-link ${!isOpen ? 'collapsed' : ''}`}
                onClick={onClick}
                aria-expanded={isOpen ? "true": "false"}
            >
                {icon &&
                <FontAwesomeIcon
                  icon={icon}
                  fixedWidth
                  className="align-middle mr-2"
                />
                }
                <span className="align-middle">{name}</span>
                {badgeColor && badgeText ?
                    <Badge color={badgeColor} size={18} pill className="sidebar-badge">
                        {badgeText}
                    </Badge> : null
                }
            </span>
            <Collapse isOpen={isOpen}>
                <ul id="item" className="sidebar-dropdown list-unstyled">
                    {children}
                </ul>
            </Collapse>
        </li>
    )
}

export default SidebarCategory;
