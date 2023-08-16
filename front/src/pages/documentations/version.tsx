import { Version, formatDate } from "../../models/version"
import { Badge } from "reactstrap"

interface VersionProps {
    version: Version
}

const VersionJSX = ({ version }: VersionProps) => {
    return (
        <div>
            <h4 className="d-inline-block mr-1">
                <Badge color="primary">{version.name}</Badge>
            </h4>
            <h5 className="d-inline-block">
                 -- {formatDate(version.date)}
            </h5>
            <ul> {version.features.map(f => <li key={f}>{f}</li>)} </ul>
        </div>
    )
}

export default VersionJSX;