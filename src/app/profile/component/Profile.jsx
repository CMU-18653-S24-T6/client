
import Avatar from "./Avatar";

import { Container, Form, Row, Col, Button, Navbar } from "react-bootstrap";

const Profile = ({ data, onEdit }) => {

    if (data === null) {
        return (
            <Container>
                Welcome, you don&apos;t have any profile yet.
                <Button variant="primary" type="edit" onClick={onEdit}>Create</Button>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="mb-3">
                <Col sm="4"><h2>Profile</h2></Col>
            </Row>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">Avatar:</Form.Label>
                    <Col sm="8">
                        <Avatar img={data?.avatar || "./avatar.png"} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">First Name: </Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" plaintext readOnly value={data?.firstName}></Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">Last Name:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" plaintext readOnly value={data?.lastName}></Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">Address:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" plaintext readOnly value={data?.address}></Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">Age:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" plaintext readOnly value={data?.age}></Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">Tel:</Form.Label>
                    <Col sm="8">
                        <Form.Control type="text" plaintext readOnly value={data?.tel}></Form.Control>
                    </Col>
                </Form.Group>
                <Button variant="primary" type="edit" onClick={onEdit}>
                    Edit
                </Button>
            </Form>
        </Container>
    )
}

export default Profile;