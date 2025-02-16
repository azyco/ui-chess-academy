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
import { PuzzlesCoach } from './PuzzlesCoach';

import { ProfileCoach } from './ProfileCoach';

import config from '../../config';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

type userProfileType = {
	fullname: string,
	country: string,
	state: string,
	city: string,
	pincode: string,
	address: string,
	description: string,
	user_image: File | null,
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

type coachExtras = {
    fide_title: string,
    peak_rating: string,
    current_rating: string,
    successful_students: string,
    exp_trainer: string,
    perf_highlights: string,
    fees: string,
    bank_details: string,
    parent: string,
}

type DashboardCoachProps = {
    onAlert: Function,
    onLogout: any,
    coach_extras: coachExtras,
    user_authentication: userAuthenticationType,
    user_profile: userProfileType,
    updateState: Function,
    unauthorizedLogout: Function
}

type DashboardCoachState = {
}

export class DashboardCoach extends React.Component<DashboardCoachProps, DashboardCoachState>{
    // constructor(props: DashboardCoachProps) {
    //     super(props);
    // }

    render() {
        return (
            <Container fluid >
                <Tab.Container defaultActiveKey="profile">
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
                                        {/* <Nav.Item>
                                            <Nav.Link eventKey="puzzles">{config.puzzlesTabText}</Nav.Link>
                                        </Nav.Item> */}
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
                                    <ProfileCoach
                                        unauthorizedLogout={this.props.unauthorizedLogout}
                                        updateState={this.props.updateState}
                                        onAlert={this.props.onAlert}
                                        user_profile={this.props.user_profile}
                                        coach_extras={this.props.coach_extras}
                                        user_authentication={this.props.user_authentication}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="classes">
                                    <ClassCoach
                                        unauthorizedLogout={this.props.unauthorizedLogout}
                                        user_authentication={this.props.user_authentication}
                                        onAlert={this.props.onAlert}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="assignments">
                                    <AssignmentsCoach
                                        unauthorizedLogout={this.props.unauthorizedLogout}
                                        user_authentication={this.props.user_authentication}
                                        onAlert={this.props.onAlert}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="puzzles">
                                    <PuzzlesCoach
                                        unauthorizedLogout={this.props.unauthorizedLogout}
                                        user_authentication={this.props.user_authentication}
                                        onAlert={this.props.onAlert}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        );
    }
}
