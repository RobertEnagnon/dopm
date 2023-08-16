import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

type ButtonListProps = {
  title: string;
  horizontal: boolean;
  data: Array<any>;
  selectedData?: number;
  onClick: (data: any) => any;
  css?: any;
};

enum DotColor {
  primary = "#3b7ddd",
  warning = "#fd7e14",
  success = "#28a745",
  danger = "#c82333",
}

const ButtonList = ({
  title,
  horizontal,
  data,
  selectedData,
  onClick,
  css,
}: ButtonListProps) => {
  return (
    <Card style={{overflow: 'hidden'}}>
      <CardHeader style={css?.CardHeader ?? {}} className="bg-white pb-0">
        <CardTitle tag="h3" className="card-title" style={css?.CardTitle ?? {}}>
          {title}
        </CardTitle>
        <CardBody
          className="card-body"
          style={css?.CardBody ?? { padding: "0px" }}
        >
          <ListGroup
            horizontal={horizontal ? "lg" : false}
            type="unstyled"
            style={{ padding: "5px" }}
          >
            {data.map((d, i) => {
              return (
                <Col key={i}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <ListGroupItem
                      className="justify-content-between"
                      style={{
                        padding: 0,
                        margin: "5px",
                        border: "0px solid red",
                      }}
                    >
                      {d.fileName ? (
                        <Button
                          color={"primary"}
                          block
                          className="btn"
                          onClick={() => onClick(i)}
                          style={{ boxShadow: "0px 4px 12px #afafaf" }}
                        >
                          {d.name?.toUpperCase()}
                        </Button>
                      ) : (
                        <Button
                          color={d.color ?? "warning"}
                          block
                          onClick={() => onClick(i)}
                          className="btn"
                          style={{ boxShadow: "0px 4px 12px #afafaf" }}
                        >
                          {d.name?.toUpperCase()}
                          {d.indicators && (
                            <Badge
                              color={d.color ?? "warning"}
                              pill
                              style={{ margin: "5px", padding: "auto" }}
                            >
                              {d.indicators.length}
                            </Badge>
                          )}
                        </Button>
                      )}
                    </ListGroupItem>
                    {horizontal && selectedData == d.id && (
                      <div
                        style={{
                          borderBottom: `8px solid ${
                            DotColor[d.color as keyof typeof DotColor]
                          }`,
                          width: "8px",
                          margin: "2px auto 0 auto",
                          borderRadius: "100%",
                        }}
                      />
                    )}
                  </div>
                </Col>
              );
            })}
          </ListGroup>
        </CardBody>
      </CardHeader>
    </Card>
  );
};

export default ButtonList;
