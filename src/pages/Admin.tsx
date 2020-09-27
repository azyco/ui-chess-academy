import React from 'react';

import {
    Container,
    Button,
    Row, Col,
    Nav, Tab,
    Form,
    Card
} from 'react-bootstrap';

import config from '../config';
 
type AdminProps = {
    onAlert: Function,
    onLogout: any,
    user_details: userDetailsType
}

type AdminState = {

}

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

export class Admin extends React.Component<AdminProps, AdminState>{
    constructor(props:AdminProps){
        super(props);
    }

    render (){
        return(
            <Container fluid >
                <Tab.Container id="left-tabs-example" defaultActiveKey="profile">
                    <Row>
                        <Col lg={2}>
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Body>
                                    <Nav variant="pills" className="flex-column" >
                                        <Nav.Item>
                                            <Nav.Link eventKey="profile">Update Profile</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="classes">Create Classes</Nav.Link>
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
                                    <Container>
                                        <Card bg="light" style={{ marginTop: '1em' }}>
                                            <Card.Header as='h5'>Classes</Card.Header>
                                            <Card.Body>
                                                Update Profiles
                                            </Card.Body>
                                        </Card>
                                    </Container>
                                </Tab.Pane>
                                <Tab.Pane eventKey="classes">
                                    <Container>
                                        <Card bg="light" style={{ marginTop: '1em' }}>
                                            <Card.Header as='h5'>Assignments</Card.Header>
                                            <Card.Body>
                                                Create Classes
                                            </Card.Body>
                                        </Card>
                                    </Container>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        )
    }
}
