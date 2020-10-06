import React from 'react';
import {
    Container,
    Button,
    Row, Col,
    Nav, Tab,
    Card
} from 'react-bootstrap';

import { ClassCoach } from './ClassCoach';
import { AssignmentsCoach } from './AssignmentsCoach';
import { ProfileCoach } from './ProfileCoach';

import config from '../../config';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
}
type userProfileType = {
    fullname: string,
    country: string,
    state: string,
    description: string,
    user_image: Blob,
    fide_id: string,
    lichess_id: string,
    contact: string,
    contact_code: string,
    alt_contact: string,
    alt_contact_code: string,
    dob: Date,
    parent: string,
    is_private_contact: boolean,
    is_private_alt_contact: boolean,
    is_private_dob: boolean,
    is_private_parent: boolean
}

type DashboardCoachProps = {
    onAlert: Function,
    onLogout: any,
    user_authentication: userAuthenticationType,
    user_profile: userProfileType,
    updateState: Function
}

type DashboardCoachState = {
    profile_edit_mode: boolean,
    fullname: string,
    fullname_is_invalid: boolean,
    state: string,
    description: string,
    fide_id: string,
    lichess_id: string,
    password: string,
    password_is_invalid: boolean,
    dob: Date,
    dob_is_invalid: boolean,
    photo_blob: Blob,
    is_private_contact: boolean,
    is_private_alt_contact: boolean,
    is_private_dob: boolean
}

export class DashboardCoach extends React.Component<DashboardCoachProps, DashboardCoachState>{
    constructor(props: DashboardCoachProps) {
        super(props);
    }

    render() {
        return (
            <Container fluid >
                <Tab.Container id="left-tabs-example" defaultActiveKey="profile">
                    <Row>
                        <Col lg={2}>
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Body>
                                    <Nav variant="pills" className="flex-column" >
                                        <Nav.Item>
                                            <Nav.Link eventKey="profile">{config.profileTabText}</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="classes">{config.classesTabText}</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="assignments">{config.assignmentsTabText}</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="puzzles">{config.puzzlesTabText}</Nav.Link>
                                        </Nav.Item>
                                        <Button variant={"warning"} onClick={this.props.onLogout} >
                                            {config.logoutButtonText}
                                        </Button>
                                    </Nav>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={10}>
                            <Tab.Content>
                                <Tab.Pane eventKey="profile">
                                    <ProfileCoach updateState={this.props.updateState} onAlert={this.props.onAlert} user_profile={this.props.user_profile} user_authentication={this.props.user_authentication} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="classes">
                                    <ClassCoach user_authentication={this.props.user_authentication}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="assignments">
                                    <Container>
                                        <Card bg="light" style={{ marginTop: '1em' }}>
                                            <Card.Header as='h5'>Assignments</Card.Header>
                                            <Card.Body>
                                                <AssignmentsCoach />
                                            </Card.Body>
                                        </Card>
                                    </Container>
                                </Tab.Pane>
                                <Tab.Pane eventKey="puzzles">
                                    <Container>
                                        <Card bg="light" style={{ marginTop: '1em' }}>
                                            <Card.Header as='h5'>Puzzles</Card.Header>
                                            <Card.Body>
                                                Puzzles
                                            </Card.Body>
                                        </Card>
                                    </Container>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        );
    }
}
