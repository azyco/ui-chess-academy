import React from 'react';

import {
    Container,
    Card
} from 'react-bootstrap';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

type AssignmentsStudentProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function,
    unauthorizedLogout: Function
}

type AssignmentsStudentState = {
    
}

export class AssignmentsStudent extends React.Component<AssignmentsStudentProps, AssignmentsStudentState>{
    // constructor(props: DashboardStudentProps) {
    //     super(props);
    // }
    render() {
        return (
            <Container>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Assignments</Card.Header>
                    <Card.Body>
                        Create assignments
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}
