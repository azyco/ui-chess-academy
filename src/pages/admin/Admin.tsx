import React from 'react';

import {
    Container,
    Button,
    Row, Col,
    Nav, Tab,
    Card
} from 'react-bootstrap';

import { ClassroomManagement } from './ClassroomManagement';
import { CoachManagement } from './CoachManagement';
import { StudentManagement } from './StudentManagement';

import config from '../../config';
// import Api from '../../api/backend';

type AdminProps = {
    onAlert: Function,
    onLogout: any,
    user_authentication: userAuthenticationType
}

type AdminState = {

}

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
}

export class Admin extends React.Component<AdminProps, AdminState>{
    constructor(props: AdminProps) {
        super(props);
    }

    render() {
        return (
            <Container fluid >
                <Tab.Container id="left-tabs-example" defaultActiveKey="classroom">
                    <Row>
                        <Col lg={2}>
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Body>
                                    <Nav variant="pills" className="flex-column" >
                                        <Nav.Item>
                                            <Nav.Link eventKey="classroom">{config.classroomManagementTab} </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="coach">{config.coachManagementTab} </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="student">Student Management</Nav.Link>
                                        </Nav.Item>
                                        <Button variant={"warning"} onClick={this.props.onLogout} >
                                            Logout
                                        </Button>
                                    </Nav>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={10}>
                            <Tab.Content>
                                <Tab.Pane eventKey="classroom">
                                    <ClassroomManagement onAlert={this.props.onAlert} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="coach">
                                    <CoachManagement onAlert={this.props.onAlert} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="student">
                                    <StudentManagement onAlert={this.props.onAlert} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        )
    }
}
