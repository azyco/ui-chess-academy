import React from 'react';
import {
    Container,
    Button,
    Row, Col,
    Nav, Tab,
    Form,
    Card
} from 'react-bootstrap';
import { ClassStudent } from './ClassStudent';
import { AssignmentsStudent } from './AssignmentsStudent';

import config from '../../config';

type userDetailsType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
    fullname: string,
    country: string,
    state: string,
    description: string,
    user_image: Blob,
    fide_id: string,
    lichess_id: string,
    contact: number,
    contact_code: number,
    alt_contact: number,
    alt_contact_code: number,
    dob: Date,
    parent: string,
    is_private_contact: boolean,
    is_private_alt_contact: boolean,
    is_private_dob: boolean,
    is_private_parent: boolean
}

type DashboardStudentProps = {
    onAlert: Function,
    onLogout: any,
    user_details: userDetailsType
}

type DashboardStudentState = {
    is_sidebar_collapsed: boolean,
}

export class DashboardStudent extends React.Component<DashboardStudentProps, DashboardStudentState>{
    constructor(props: DashboardStudentProps) {
        super(props);
        this.state = {
            is_sidebar_collapsed: true,
        };
    }

    showParent() {
        if (this.props.user_details?.parent) {
            return (
                <div>
                    <Form.Label>{config.parentLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridParent">
                            <Form.Control readOnly value={this.props.user_details?.parent} />
                        </Form.Group>
                    </Form.Row>
                </div>
            );
        }
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
                                            <Nav.Link eventKey="profile">Profile</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="classes">Classes</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="assignments">Assignments</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="puzzles">Puzzles</Nav.Link>
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
                                <Tab.Pane eventKey="profile">
                                    <Card bg="light" style={{ marginTop: '1em' }}>
                                        <Card.Header as='h5'>Profile Details</Card.Header>
                                        <Card.Body>
                                            <Container fluid>
                                                <Form >
                                                    <Form.Label>{config.emailAndPasswordLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group md={6} as={Col} controlId="formGridEmail">
                                                            <Form.Control readOnly type="email" value={this.props.user_details?.email} />
                                                        </Form.Group>
                                                        <Form.Group md={6} as={Col} controlId="formGridPassword">
                                                            <Form.Control readOnly type="password" value={'******'} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Label>{config.fullNameLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridFullName">
                                                            <Form.Control readOnly value={this.props.user_details?.fullname} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Label>{config.countryAndStateLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group md={6} as={Col} controlId="formGridCountry">
                                                            <Form.Control readOnly value={this.props.user_details?.country} />
                                                        </Form.Group>
                                                        <Form.Group md={6} as={Col} controlId="formGridState">
                                                            <Form.Control readOnly value={this.props.user_details?.state} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Label>{config.dobLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridDate">
                                                            <Form.Control readOnly value={this.props.user_details.dob.toDateString()} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    {this.showParent()}
                                                    <Form.Label>{config.contactLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group xs={4} as={Col} controlId="formGridContactCode">
                                                            <Form.Control readOnly value={this.props.user_details?.contact_code} />
                                                        </Form.Group>
                                                        <Form.Group xs={8} as={Col} controlId="formGridContact">
                                                            <Form.Control readOnly type="number" value={this.props.user_details?.contact} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Label>{config.altContactLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group xs={4} as={Col} controlId="formGridAltContactCode">
                                                            <Form.Control readOnly value={this.props.user_details?.alt_contact_code} />
                                                        </Form.Group>
                                                        <Form.Group xs={8} as={Col} controlId="formGridAltContact">
                                                            <Form.Control readOnly type="number" value={this.props.user_details?.alt_contact_code} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Label>{config.descriptionLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridDescription">
                                                            <Form.Control readOnly as="textarea" value={this.props.user_details?.description} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Label>{config.fideLichessLabel}</Form.Label>
                                                    <Form.Row>
                                                        <Form.Group md={6} as={Col} controlId="formGridFideID">
                                                            <Form.Control readOnly value={this.props.user_details?.fide_id} />
                                                        </Form.Group>
                                                        <Form.Group md={6} as={Col} controlId="formGridLichessID">
                                                            <Form.Control readOnly value={this.props.user_details?.lichess_id} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    {/* <Form.Label>{config.imageLabel}</Form.Label>
                                                <Form.Row>
                                                    <Form.Group as={Col} >
                                                            <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label={config.imagePlaceholder} custom />
                                                    </Form.Group>
                                                </Form.Row> */}
                                                </Form>
                                            </Container>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="classes">
                                    <Container>
                                        <Card bg="light" style={{ marginTop: '1em' }}>
                                            <Card.Header as='h5'>Classes</Card.Header>
                                            <Card.Body>
                                                <ClassStudent />
                                            </Card.Body>
                                        </Card>
                                    </Container>
                                </Tab.Pane>
                                <Tab.Pane eventKey="assignments">
                                    <Container>
                                        <Card bg="light" style={{ marginTop: '1em' }}>
                                            <Card.Header as='h5'>Assignments</Card.Header>
                                            <Card.Body>
                                                <AssignmentsStudent />
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
