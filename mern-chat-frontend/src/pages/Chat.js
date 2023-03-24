import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";


function Chat() {
    return (
        <Container fluid style={{width: "100%"}}>
            <Row>
                <Col md={4}>
                    <Sidebar />
                </Col>
                <Col xs={8}>
                    <MessageForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;
