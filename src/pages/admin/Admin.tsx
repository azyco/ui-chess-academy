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

// import config from '../../config';
// import Api from '../../api/backend';

type AdminProps = {
    onAlert: Function,
    onLogout: any,
    user_authentication: userAuthenticationType
}

type classroom = {
    id: number,
    name: string,
    description: string,
    is_active: boolean,
    created_at: Date,
    student_count: number,
    coaches: string[]
}

type user = {
    id: number,
    email: string,
    user_type: string,
    fullname: string
}

type AdminState = {
    classroom_array: classroom[],
    student_array: (user | null)[],
    student_array_selected: (user | null)[],
    coach_array: (user | null)[],
    coach_array_selected: (user | null)[],
    selected_source_student_array_index: number,
    selected_destination_student_array_index: number,
    selected_source_coach_array_index: number,
    selected_destination_coach_array_index: number,
    classroom_name: string,
    classroom_description: string,
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
                                            <Nav.Link eventKey="classroom">Classroom Management </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="coach">Coach Management </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="profile">Profile Management </Nav.Link>
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
                                    <ClassroomManagement onAlert={this.props.onAlert}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="coach">
                                    <CoachManagement onAlert={this.props.onAlert}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="profile">
                                    <Card bg="light" style={{ marginTop: '1em' }}>
                                        <Card.Header as='h5'>Update Profile</Card.Header>
                                        <Card.Body>
                                            Update Profiles
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        )
    }
}
