import {Col, Container, Row} from "reactstrap";

const Footer = () => {
    return (
        <footer className="footer">
            <Container fluid>
                <Row className="text-muted">
                    <Col xs={12} className="text-right">
                        <p className="mb-0">
                            &copy; {new Date().getFullYear()} -{" "}
                            <a href={"https://dopm.fr/"} className='text-muted'>
                                SoDigitale
                            </a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;
