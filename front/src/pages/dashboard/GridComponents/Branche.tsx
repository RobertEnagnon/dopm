import { useEffect, useState } from "react";
import { Badge, Button, ListGroup, ListGroupItem, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { Category } from "../../../models/Top5/category";
import { Branch } from "../../../models/Top5/branch";
import { useCategories } from "../../../hooks/Top5/category";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../components/context/user.context";
import { permissionsList } from "../../../models/Right/permission";
// import { Language } from "../../../services/enums/Language";

type BrancheProps = {
  brancheId: number,
  titleChange: Function,
  horizontal: boolean
}

export default function Branche({ brancheId, titleChange, horizontal }: BrancheProps) {
  const { t } = useTranslation();
  const userContext = useUser();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [branche, setBranche] = useState<Branch>();
  const [getCategoriesByBranch] = useCategories();
  useEffect(() => {
    getCategories(brancheId);
  }, [brancheId]);
  const getCategories = async (branch: number) => {
    const { selectedBranch, updatedCategories } = await getCategoriesByBranch(branch);
    titleChange(`${t("dashboard.dashboard")} ${selectedBranch?.name}`);
    setBranche(selectedBranch);
    setCategories(updatedCategories);
  };
  return (
    <ListGroup
      style={{ height: "100%" }}
      horizontal={horizontal}
      type="unstyled"
    >
      {categories?.map((category) => {
        return (
          <Col key={category.id}>
            <ListGroupItem
              className="justify-content-between"
              style={{ padding: 0, margin: "5px", border: '0px solid red' }}
            >
              <BrancheVignette
                allowed={userContext.checkAccess(permissionsList.lectureGraphique, branche?.id, category.id)
                  || userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branche?.id, category.id)}
                to={`/Top5/${branche?.name}?category=${category.id}`}
              >
                <Button
                  color={category?.color || "warning"}
                  block
                  style={{ boxShadow: '0px 4px 12px #afafaf',
                    cursor: userContext.checkAccess(permissionsList.lectureGraphique, branche?.id, category.id)
                      || userContext.checkAccess(permissionsList.ajoutDonneesCategorie, branche?.id, category.id) ? 'pointer' : 'auto'
                  }}
                >
                  {`${category.name}`.toUpperCase()}
                  {category.indicator && (
                    <Badge
                      color={category.color || "warning"}
                      pill
                      style={{ margin: "5px", padding: "auto" }}
                    >
                      {category.indicator.length}
                    </Badge>
                  )}
                </Button>
              </BrancheVignette>
            </ListGroupItem>
          </Col>
        );
      })}
    </ListGroup>
  );
}

const BrancheVignette = ({ allowed, to, children }: { allowed: boolean, to: string, children: JSX.Element }) => {
  return (
    allowed ? <Link to={to} style={{ textDecoration: 'none' }}>{children} </Link> : <>{children}</>
  );
}


