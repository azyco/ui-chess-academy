import React from 'react';

import {
    Tab, Tabs,
} from 'react-bootstrap';

//import config from '../../config';
import { AssignmentsCreateCoach } from './AssignmentsCreateCoach';
import { AssignmentsCheckCoach } from './AssignmentsCheckCoach';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

type AssignmentsCoachProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function,
    unauthorizedLogout: Function,
}

type AssignmentsCoachState = {
}

export class AssignmentsCoach extends React.Component<AssignmentsCoachProps, AssignmentsCoachState>{
    constructor(props: AssignmentsCoachProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Tabs defaultActiveKey="create" variant="tabs" style={{ marginTop: '1em' }} fill justify>
                <Tab eventKey="create" title="Create">
                    <AssignmentsCreateCoach unauthorizedLogout={this.props.unauthorizedLogout} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} />
                </Tab>
                <Tab eventKey="check" title="Check">
                    <AssignmentsCheckCoach unauthorizedLogout={this.props.unauthorizedLogout} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} />
                </Tab>
            </Tabs>
            // <Tab.Container defaultActiveKey="create">
            //     <Row>
            //         <Col>
            //             <Card bg="light" style={{ marginTop: '1em' }}>
            //                 <Card.Body>
            //                     <Nav variant="pills" fill justify >
            //                         <Nav.Item>
            //                             <Nav.Link eventKey="create">Create Assignments</Nav.Link>
            //                         </Nav.Item>
            //                         <Nav.Item>
            //                             <Nav.Link eventKey="check">Check Assignments</Nav.Link>
            //                         </Nav.Item>
            //                     </Nav>
            //                 </Card.Body>
            //             </Card>
            //         </Col>
            //     </Row>
            //     <Row>
            //         <Col>
            //             <Tab.Content>
            //                 <Tab.Pane eventKey="create">
            //                     <AssignmentsCreateCoach unauthorizedLogout={this.props.unauthorizedLogout} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} />
            //                 </Tab.Pane>
            //                 <Tab.Pane eventKey="check">
            //                     <AssignmentsCheckCoach unauthorizedLogout={this.props.unauthorizedLogout} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} />
            //                 </Tab.Pane>
            //             </Tab.Content>
            //         </Col>
            //     </Row>
            // </Tab.Container>
        )
    }
}