import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

function Home() {
    return (
        <Row style={{backgroundColor: "#FCFDFC", marginRight: "10em"}}>
            <Col md={7} className="d-flex flex-direction-column align-items-center justify-content-center">
                <div>
                    <h1>Chatter-Bird</h1>
                    <p>The Fastest Messenger Bird</p>
                    <LinkContainer to="/login">
                        <Button variant="success" style={{backgroundColor: "blue", border: "1px solid #594297"}}>
                            Get Started <i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                </div>
            </Col>
            <Col s={8} className="home__bg"></Col>
        </Row>
    );
}

export default Home;
